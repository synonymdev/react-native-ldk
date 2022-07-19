package com.reactnativeldk.classes

import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.structs.Logger
import org.ldk.structs.Record
import java.io.File

class LdkLogger {
    var activeLevels = HashMap<Int, Boolean>()
    var logger = Logger.new_impl{ record: Record ->
        if (activeLevels[record._level.ordinal] == true) {
            LdkEventEmitter.send(EventTypes.ldk_log, record._args)
            LogFile.write(record._args)
        }
    }

    fun setLevel(level: Int, active: Boolean) {
        activeLevels[level] = active;
        LdkEventEmitter.send(EventTypes.native_log, "Log level ${level} set to ${active}")
    }
}

object LogFile {
    private var logFile: File? = null

    fun setFilePath(path: String) {
        logFile = File(path)
        if (!logFile!!.isFile) {
            logFile!!.createNewFile()
        }
    }

    fun write(str: String) {
        if (logFile == null) {
            return
        }
        logFile!!.appendText("${str}\n")
    }
}
