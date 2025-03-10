require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-ldk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-ldk
                   DESC
  s.homepage     = "https://github.com/synonymdev/react-native-ldk"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "synonymdev" => "jason@synonym.to" }
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/synonymdev/react-native-ldk.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.vendored_frameworks = 'ios/LightningDevKit.xcframework'
  s.dependency "React"
  
  # Explicitly specify supported architectures
  s.pod_target_xcconfig = { 
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'VALID_ARCHS' => 'arm64 arm64e x86_64'
  }
  s.user_target_xcconfig = { 
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'VALID_ARCHS' => 'arm64 arm64e x86_64'
  }
end
