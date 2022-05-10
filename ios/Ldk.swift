import LDKFramework

@objc(Ldk)
class Ldk: NSObject {    
    @objc
    func version(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        resolve("\(Bindings.swift_ldk_c_bindings_get_compiled_version()), \(Bindings.swift_ldk_get_compiled_version())")
    }
}
