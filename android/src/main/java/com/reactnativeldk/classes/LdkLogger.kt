package com.reactnativeldk.classes

import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.structs.Logger
import org.ldk.structs.Record

class LdkLogger {
    var activeLevels = HashMap<Int, Boolean>()
    var logger = Logger.new_impl{ record: Record ->
       println(record.toString())

        if (activeLevels[record._level.ordinal] == true) {
            LdkEventEmitter.send(EventTypes.ldk_log, record._args)
        }
    }

    fun setLevel(level: Int, active: Boolean) {
        activeLevels.set(level, active);
        LdkEventEmitter.send(EventTypes.swift_log, "Log level ${level} set to ${active}")
    }
}