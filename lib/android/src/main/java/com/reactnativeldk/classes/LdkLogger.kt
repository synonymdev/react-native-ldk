package com.reactnativeldk.classes

import android.annotation.SuppressLint
import com.reactnativeldk.EventTypes
import com.reactnativeldk.LdkEventEmitter
import org.ldk.structs.Logger
import org.ldk.structs.Record
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date

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
            val line = "$level (LDK): ${record._args} (${record._module_path} ${record._line})"
            LdkEventEmitter.send(EventTypes.ldk_log, line)
            LogFile.write(line)
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

    @SuppressLint("SimpleDateFormat")
    fun write(str: String) {
        if (logFile == null) {
            return
        }

        val dateFormatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
        val line = "${dateFormatter.format(Date())} $str\n"

        logFile!!.appendText(line)
    }
}
