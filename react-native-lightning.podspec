require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-lightning"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-lightning
                   DESC
  s.homepage     = "https://github.com/synonymdev/react-native-lightning"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "synonymdev" => "jason@synonym.to" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/synonymdev/react-native-lightning.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.vendored_frameworks = 'ios/Lndmobile.framework'
  s.dependency "React"
end
