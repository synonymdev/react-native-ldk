package com.reactnativeldk.classes

import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.structs.Logger
import org.ldk.structs.Record
import java.io.File

private fun levelString(level: Int): String {
    when (level) {
        0 -> return "GOSSIP"
        1 -> return "TRACE"
        2 -> return "DEBUG"
        3 -> return "INFO"
        4 -> return "WARN"
        5 -> return "ERROR"
    }

    return "LEVEL $level"
}

class LdkLogger {
    var activeLevels = HashMap<String, Boolean>()
    var logger = Logger.new_impl{ record: Record ->
        val level = levelString(record._level.ordinal)

        if (activeLevels[level] == true) {
            LdkEventEmitter.send(EventTypes.ldk_log, record._args)
            LogFile.write( "$level (LDK): ${record._args}")
        }
    }

    fun setLevel(level: String, active: Boolean) {
        activeLevels[level] = active;
        LdkEventEmitter.send(EventTypes.native_log, "Log level ${level} set to ${active}")
    }
}

object LogFile {
    private var logFile: File? = null

    fun setFilePath(logFile: File) {
        if (!logFile.isFile) {
            logFile.createNewFile()
        }

        this.logFile = logFile
    }

    fun write(str: String) {
        if (logFile == null) {
            return
        }

        logFile!!.appendText("${str}\n")
    }
}
