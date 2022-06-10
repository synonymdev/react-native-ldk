package com.reactnativeldk.classes

import org.ldk.batteries.ChannelManagerConstructor
import org.ldk.structs.Event

class LdkChannelManagerPersister {
    var channelManagerPersister = object : ChannelManagerConstructor.EventHandler {
        override fun handle_event(event: Event) {
            //TODO
        }

        override fun persist_manager(channel_manager_bytes: ByteArray?) {
            //TODO
        }

        override fun persist_network_graph(network_graph: ByteArray?) {
            //TODO
        }
    }
}