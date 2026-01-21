#!/bin/bash

# E2E Test Execution Script for react-native-ldk
# Usage: ./e2e/run.sh [platform] [action] [build-type] [test-suite]
#
# Examples:
#   ./e2e/run.sh ios build debug
#   ./e2e/run.sh android test release
#   ./e2e/run.sh ios test debug startup
#   ./e2e/run.sh android build release

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

# Print usage
usage() {
    cat <<EOF
Usage: $0 [platform] [action] [build-type] [test-suite]

Arguments:
  platform     ios | android
  action       build | test | all
  build-type   debug | release
  test-suite   (optional) startup | channels | payments | backup-restore | force-close | network-graph

Examples:
  $0 ios build debug              # Build iOS debug
  $0 android test release         # Run Android release tests
  $0 ios all debug                # Build and test iOS debug
  $0 ios test debug startup       # Run only startup tests
  $0 android all release payments # Build and run payment tests

EOF
    exit 1
}

# Validate arguments
if [ $# -lt 3 ]; then
    print_error "Insufficient arguments"
    usage
fi

PLATFORM=$1
ACTION=$2
BUILD_TYPE=$3
TEST_SUITE=${4:-""}

# Validate platform
if [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ]; then
    print_error "Platform must be 'ios' or 'android'"
    usage
fi

# Validate action
if [ "$ACTION" != "build" ] && [ "$ACTION" != "test" ] && [ "$ACTION" != "all" ]; then
    print_error "Action must be 'build', 'test', or 'all'"
    usage
fi

# Validate build type
if [ "$BUILD_TYPE" != "debug" ] && [ "$BUILD_TYPE" != "release" ]; then
    print_error "Build type must be 'debug' or 'release'"
    usage
fi

# Construct configuration name
if [ "$PLATFORM" == "ios" ]; then
    CONFIG="ios.sim.${BUILD_TYPE}"
elif [ "$PLATFORM" == "android" ]; then
    CONFIG="android.emu.${BUILD_TYPE}"
fi

# Check if Docker is running
check_docker() {
    print_info "Checking Docker environment..."

    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    # Check if docker-compose is up
    cd docker
    RUNNING=$(docker compose ps --services --filter "status=running" | wc -l)
    cd ..

    if [ "$RUNNING" -lt 6 ]; then
        print_warning "Docker services not fully running. Starting docker-compose..."
        cd docker
        docker compose up -d
        cd ..
        print_info "Waiting for services to start..."
        sleep 10
    fi

    print_success "Docker environment ready"
}

# Check dependencies
check_dependencies() {
    print_info "Checking dependencies..."

    if ! command -v detox &> /dev/null; then
        print_error "Detox CLI not found. Install with: npm install -g detox-cli"
        exit 1
    fi

    if [ "$PLATFORM" == "ios" ]; then
        if ! command -v xcodebuild &> /dev/null; then
            print_error "xcodebuild not found. Please install Xcode."
            exit 1
        fi
    fi

    if [ "$PLATFORM" == "android" ]; then
        if ! command -v adb &> /dev/null; then
            print_error "adb not found. Please install Android SDK."
            exit 1
        fi
    fi

    print_success "Dependencies OK"
}

# Build the app
build_app() {
    print_info "Building ${PLATFORM} ${BUILD_TYPE} app..."

    if [ "$PLATFORM" == "ios" ]; then
        detox build -c "$CONFIG"
    else
        # For Android, ensure emulator is running
        check_android_emulator
        detox build -c "$CONFIG"
    fi

    print_success "Build complete"
}

# Check Android emulator
check_android_emulator() {
    if [ "$PLATFORM" == "android" ]; then
        print_info "Checking Android emulator..."

        DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)
        if [ "$DEVICES" -eq 0 ]; then
            print_warning "No Android emulator running. Please start an emulator or connect a device."
            print_info "Starting emulator Pixel_API_31_AOSP..."

            # Try to start emulator
            if command -v emulator &> /dev/null; then
                emulator -avd Pixel_API_31_AOSP &
                sleep 30
            else
                print_error "Emulator not found. Please start it manually."
                exit 1
            fi
        fi

        print_success "Android emulator ready"
    fi
}

# Setup Android port forwarding
setup_android_ports() {
    if [ "$PLATFORM" == "android" ]; then
        print_info "Setting up Android port forwarding..."

        # Reverse ports for Docker services (10.0.2.2 maps to host localhost)
        adb reverse tcp:8081 tcp:8081   # Metro
        adb reverse tcp:8080 tcp:8080   # LND REST
        adb reverse tcp:9735 tcp:9735   # LND P2P
        adb reverse tcp:10009 tcp:10009 # LND RPC
        adb reverse tcp:18081 tcp:18081 # Core Lightning REST
        adb reverse tcp:9736 tcp:9736   # Core Lightning P2P
        adb reverse tcp:11001 tcp:11001 # Core Lightning RPC
        adb reverse tcp:28081 tcp:28081 # Eclair REST
        adb reverse tcp:9737 tcp:9737   # Eclair P2P
        adb reverse tcp:60001 tcp:60001 # Electrum
        adb reverse tcp:18443 tcp:18443 # Bitcoin RPC
        adb reverse tcp:3003 tcp:3003   # Backup server

        print_success "Port forwarding configured"
    fi
}

# Run tests
run_tests() {
    print_info "Running ${PLATFORM} ${BUILD_TYPE} tests..."

    # Setup Android ports if needed
    setup_android_ports

    # Construct test path
    if [ -n "$TEST_SUITE" ]; then
        TEST_PATH="e2e/${TEST_SUITE}.e2e.js"
        if [ ! -f "$TEST_PATH" ]; then
            print_error "Test suite not found: $TEST_PATH"
            exit 1
        fi
        print_info "Running test suite: $TEST_SUITE"
    else
        TEST_PATH="e2e"
        print_info "Running all test suites"
    fi

    # Run detox tests
    detox test -c "$CONFIG" "$TEST_PATH" --loglevel trace

    print_success "Tests complete"
}

# Clean up
cleanup() {
    print_info "Cleaning up..."

    # Remove test completion markers
    rm -f e2e/.complete-*

    if [ "$PLATFORM" == "android" ]; then
        # Clear Android reverse ports
        adb reverse --remove-all 2>/dev/null || true
    fi
}

# Main execution
main() {
    print_info "react-native-ldk E2E Test Runner"
    print_info "Platform: $PLATFORM | Action: $ACTION | Build: $BUILD_TYPE"

    # Always check Docker and dependencies
    check_docker
    check_dependencies

    # Execute action
    if [ "$ACTION" == "build" ] || [ "$ACTION" == "all" ]; then
        build_app
    fi

    if [ "$ACTION" == "test" ] || [ "$ACTION" == "all" ]; then
        run_tests
    fi

    print_success "All done!"
}

# Trap cleanup on exit
trap cleanup EXIT

# Run main
main
