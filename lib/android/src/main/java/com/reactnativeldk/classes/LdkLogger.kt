package com.reactnativeldk.classes

import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.structs.Logger
import org.ldk.structs.Record
import java.io.File

class LdkLogger {
    var activeLevels = HashMap<Int, Boolean>()
    var logger = Logger.new_impl{ record: Record ->
        val level = record._level.ordinal
        if (activeLevels[level] == true) {
            LdkEventEmitter.send(EventTypes.ldk_log, record._args)

            var levelStr = "LEVEL $level"
            when (level) {
                0 -> levelStr = "GOSSIP"
                1 -> levelStr = "TRACE"
                2 -> levelStr = "DEBUG"
                3 -> levelStr = "INFO"
                4 -> levelStr = "WARN"
                5 -> levelStr = "ERROR"
            }

            LogFile.write( "$levelStr (LDK): ${record._args}")
        } else {
            println("Skipping log level $level")
        }
    }

    fun setLevel(level: Int, active: Boolean) {
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
