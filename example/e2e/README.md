# E2E Tests for react-native-ldk

Comprehensive end-to-end tests for react-native-ldk using Detox, modeled after [Bitkit's E2E test patterns](https://github.com/synonymdev/bitkit/tree/master/e2e).

## 🚀 Quick Start: RPC-Driven Tests (No UI Required!)

**Want to run tests immediately without building any UI?** Use the RPC-driven tests:

```bash
cd example/docker && docker compose up     # Start regtest environment
cd example
yarn e2e:build:ios-debug                   # Build app
yarn e2e:test:rpc                          # Run RPC tests - works now!
```

See [RPC_DRIVEN_TESTS.md](./RPC_DRIVEN_TESTS.md) for details.

## Overview

This test suite provides **two testing approaches**:

1. **RPC-Driven Tests** ([ldk-rpc.e2e.js](./ldk-rpc.e2e.js)) - ✅ **Works now!**
   - Tests LDK functionality via direct API calls
   - No UI implementation required
   - Fast, reliable, comprehensive coverage
   - Perfect for TDD and API verification

2. **UI-Driven Tests** - ⊘ Requires UI implementation
   - Tests user experience flows
   - Validates UI interactions
   - Ensures accessibility
   - Complementary to RPC tests

## Test Organization

### RPC-Driven Tests (Ready to Use)

| Test Suite | File | Coverage | Status |
|-----------|------|----------|---------|
| **LDK RPC Tests** | [ldk-rpc.e2e.js](./ldk-rpc.e2e.js) | Full LDK API coverage: init, channels, payments, events | ✅ **Works Now!** |

### UI-Driven Tests (Require UI)

| Test Suite | File | Coverage | Status |
|-----------|------|----------|---------|
| **Startup** | [startup.e2e.js](./startup.e2e.js) | LDK initialization, account creation, blockchain sync | ✅ Basic tests work |
| **Channels** | [channels.e2e.js](./channels.e2e.js) | Channel opening, management, cooperative close | ⊘ Requires UI |
| **Payments** | [payments.e2e.js](./payments.e2e.js) | Invoice creation, sending/receiving payments, MPP | ⊘ Requires UI |
| **Backup & Restore** | [backup-restore.e2e.js](./backup-restore.e2e.js) | Remote backup, persistence, restore flows | ⊘ Requires UI |
| **Force Close** | [force-close.e2e.js](./force-close.e2e.js) | Force close scenarios, fund recovery, justice transactions | ⊘ Requires UI |
| **Network Graph** | [network-graph.e2e.js](./network-graph.e2e.js) | Graph sync, routing, pathfinding, scorer | ⊘ Requires UI |

### Supporting Files

- [helpers.js](./helpers.js) - Reusable test utilities and RPC clients
- [config.js](./config.js) - Shared configuration (ports, accounts, timeouts)
- [run.sh](./run.sh) - Test execution script
- [.detoxrc.js](../.detoxrc.js) - Detox configuration

## Prerequisites

### System Requirements

- **Node.js**: Use version specified in `../.node-version`
- **Yarn**: 3.6.4 (specified in `packageManager` field)
- **Detox CLI**: `npm install -g detox-cli`
- **Docker**: Required for regtest environment

### iOS Requirements

- Xcode 15+
- iOS Simulator (iPhone 15)
- Command Line Tools: `xcode-select --install`

### Android Requirements

- Android Studio
- Android SDK 31+
- Android Emulator (Pixel API 31 AOSP)
- Configure emulator with sufficient resources (see Troubleshooting)

## Setup

### 1. Install Dependencies

```bash
cd example
yarn install
```

### 2. Start Docker Environment

The tests require a local Bitcoin regtest network with Lightning nodes:

```bash
cd example/docker
docker compose up
```

This starts:
- **Bitcoin Core** (regtest mode) - Port 18443
- **Electrum Server** (electrs) - Port 60001
- **LND** - REST: 8080, P2P: 9735, RPC: 10009
- **Core Lightning** - REST: 18081, P2P: 9736, RPC: 11001
- **Eclair** - REST: 28081, P2P: 9737
- **LDK Backup Server** - Port 3003

Wait for all services to start and sync (about 30 seconds).

### 3. Build the App

#### iOS

```bash
# Debug build
yarn e2e:build:ios-debug

# Release build
yarn e2e:build:ios-release
```

#### Android

```bash
# Debug build
yarn e2e:build:android-debug

# Release build
yarn e2e:build:android-release
```

## Running Tests

### Run All Tests

#### iOS

```bash
# Debug mode
yarn e2e:test:ios-debug

# Release mode
yarn e2e:test:ios-release
```

#### Android

```bash
# Debug mode (with port forwarding)
yarn e2e:test:android-debug

# Release mode
yarn e2e:test:android-release
```

### Run Specific Test Suite

```bash
# Run only startup tests
detox test -c ios.sim.debug e2e/startup.e2e.js

# Run only payment tests
detox test -c ios.sim.debug e2e/payments.e2e.js
```

### Run with Filtering

```bash
# Run tests matching pattern
detox test -c ios.sim.debug --testNamePattern="should create Lightning invoice"
```

## Test Execution Script

For convenient test execution, use the provided script:

```bash
# Build and run all tests
./e2e/run.sh ios build debug
./e2e/run.sh android build release

# Run without rebuilding
./e2e/run.sh ios test debug
./e2e/run.sh android test release

# Run specific suite
./e2e/run.sh ios test debug startup
```

## Test Patterns

### Conditional Test Execution

Tests use Bitkit's idempotence pattern for CI resilience:

```javascript
const d = checkComplete('test-name') ? describe.skip : describe;

d('Test Suite', () => {
  it('should do something', async () => {
    // Test implementation
    markComplete('test-name');
  });
});
```

This allows tests to resume from where they left off if interrupted.

### Helper Functions

Common operations are abstracted into helpers:

```javascript
// App navigation
await launchAndWait();
await navigateToDevScreen();
await waitForLDKReady();

// RPC operations
const bitcoin = new BitcoinRPC(config.bitcoin.url);
await mineBlocks(bitcoin, 6);

const lnd = new LNDRPC(config.lnd.host, config.lnd.restPort, config.lnd.macaroon);
const invoice = await lnd.addInvoice({ value: '1000' });

// Lightning operations
await waitForPeerConnection(lnd, nodeId);
await waitForActiveChannel(lnd, channelPoint);
```

### Test Configuration

All shared configuration is in [config.js](./config.js):

```javascript
const { bitcoin, lnd, electrum, timeouts, accounts } = require('./config');

// Use predefined accounts
const account = accounts.channel; // For channel tests

// Use configured timeouts
await waitForLDKReady(timeouts.ldkStart); // 3 minutes

// Access node configurations
const lndClient = new LNDRPC(lnd.host, lnd.restPort, lnd.macaroon);
```

## Current Implementation Status

### ✅ Completed

- **Test infrastructure**: Helpers, config, Detox setup
- **Test structure**: All 6 test suites created
- **Test cases**: 60+ test scenarios defined
- **Docker environment**: Full regtest setup
- **Port forwarding**: Android reverse ports configured
- **Documentation**: Comprehensive README and inline docs

### ⚠️ Requires App Implementation

Most tests are **framework tests** that define the test flow but require corresponding UI implementation in the example app:

**Startup Tests** (Ready to use):
- ✅ App launch and LDK initialization
- ✅ Version check
- ✅ Restart handling
- ✅ Blockchain sync

**Channel Tests** (Require UI):
- ⊘ Add peer flow
- ⊘ Open channel UI
- ⊘ Channel list display
- ⊘ Channel details view
- ⊘ Close channel button

**Payment Tests** (Require UI):
- ⊘ Invoice creation screen
- ⊘ Send payment flow
- ⊘ Payment history
- ⊘ Amount input fields

**Backup Tests** (Require UI):
- ⊘ Backup settings
- ⊘ Restore flow
- ⊘ Backup status indicator

**Force Close Tests** (Require UI):
- ⊘ Force close button
- ⊘ Fund recovery display
- ⊘ Justice transaction alerts

**Network Graph Tests** (Mostly automatic):
- ✅ Graph initialization (automatic)
- ✅ Graph sync (automatic)
- ⊘ Node/channel queries (require UI)

### Next Steps for Full Implementation

1. **Add UI for LDK operations**: Implement screens/buttons for:
   - Peer management (add/remove peers)
   - Channel operations (open/close)
   - Payment flows (send/receive)
   - Backup configuration
   - Force close triggers

2. **Expose test interfaces**: Add test-only element IDs:
   ```jsx
   <Button testID="addPeerButton" onPress={handleAddPeer}>
     Add Peer
   </Button>
   ```

3. **Implement missing flows**: Based on test requirements
   - See inline `⊘` markers in test files
   - Each marks where app UI is needed

4. **Update helper implementations**:
   - `getSeed()` - Extract seed from UI
   - `restoreWallet()` - Navigate restore flow
   - `completeOnboarding()` - Complete onboarding screens

## Troubleshooting

### Docker Services Won't Start

```bash
# Check docker logs
docker compose logs

# Restart services
docker compose down
docker compose up --force-recreate
```

### Android Emulator Issues

**Insufficient storage:**
```
Android Studio → Virtual Device Manager → Edit Device →
Show Advanced Settings → Increase RAM, VM heap, and Internal Storage
```

**Port forwarding not working:**
```bash
# Manually reverse ports
adb reverse tcp:8080 tcp:8080    # LND REST
adb reverse tcp:9735 tcp:9735    # LND P2P
adb reverse tcp:60001 tcp:60001  # Electrum
# ... (see .detoxrc.js for full list)
```

### iOS Simulator Issues

**Clean simulator cache:**
```bash
xcrun simctl erase all
```

**Reset simulator:**
```bash
xcrun simctl shutdown all
xcrun simctl erase all
```

### Test Timeouts

**Increase timeout for slow operations:**
```javascript
await waitFor(element(by.text('Running LDK')))
  .toBeVisible()
  .withTimeout(180000); // 3 minutes for LDK startup
```

**Common timeout causes:**
- Docker services not fully synced
- Electrum not connected to Bitcoin Core
- LND not synced to chain
- Insufficient device resources (Android)

### LDK Won't Start

**Check Docker environment is running:**
```bash
docker ps  # Should show 6 containers
```

**Verify Electrum is synced:**
```bash
curl http://localhost:60001  # Should connect
```

**Check Bitcoin Core:**
```bash
curl --user user:pass --data-binary '{"jsonrpc": "1.0", "method": "getblockcount"}' http://localhost:18443
```

## Test Coverage Mapping

These E2E tests replace the mocha-remote integration tests:

| Mocha Test | E2E Test | Status |
|-----------|----------|--------|
| `unit.ts` → Basic LDK | `startup.e2e.js` | ✅ Framework ready |
| `lnd.ts` → LND integration | `channels.e2e.js` + `payments.e2e.js` | ⊘ Requires UI |
| `lnd.ts` → Backup/restore | `backup-restore.e2e.js` | ⊘ Requires UI |
| `lnd.ts` → Force close | `force-close.e2e.js` | ⊘ Requires UI |
| `clightning.ts` | `channels.e2e.js` (CL section) | ⊘ Requires UI |
| `eclair.ts` | `channels.e2e.js` (Eclair section) | ⊘ Requires UI |

## Contributing

### Adding New Tests

1. Add test case to appropriate suite:
   ```javascript
   it('should do something new', async () => {
     // Test implementation
   });
   ```

2. Add helper functions to `helpers.js` if reusable:
   ```javascript
   const waitForSomething = async (timeout = 30000) => {
     // Implementation
   };
   module.exports = { waitForSomething, /* ... */ };
   ```

3. Update configuration in `config.js` if needed:
   ```javascript
   const myFeature = {
     timeout: 10000,
     defaultValue: 100,
   };
   module.exports = { myFeature, /* ... */ };
   ```

### Test Best Practices

- **Use descriptive test names**: `should open channel with LND` not `test1`
- **Add inline comments**: Explain non-obvious steps
- **Use helpers**: Don't duplicate common flows
- **Mark app requirements**: Use `⊘` prefix for incomplete tests
- **Test error cases**: Not just happy paths
- **Clean up after tests**: Restore state for next test

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [LDK Documentation](https://docs.rs/lightning/latest/lightning/)
- [Bitkit E2E Tests](https://github.com/synonymdev/bitkit/tree/master/e2e) (reference implementation)
- [react-native-ldk README](../README.md)

## Support

For issues with:
- **Tests**: Check inline `⊘` markers for missing implementation
- **Docker**: See `example/docker/docker-compose.yml` and logs
- **Detox**: See [.detoxrc.js](../.detoxrc.js) and [Detox docs](https://wix.github.io/Detox/docs/introduction/getting-started)
- **LDK**: See [lib/README.md](../../lib/README.md) and [LDK docs](https://docs.rs/lightning/latest/lightning/)
