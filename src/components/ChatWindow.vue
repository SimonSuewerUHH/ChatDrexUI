<template>
    <v-container fluid class="d-flex flex-column fill-height pa-0">
        <ChatHeader />
        <div class="chat-wrapper">
            <v-flex-grow class="chat-window">
                <v-container fluid class="pa-0">
                    <v-row v-for="(message, index) in messages" :key="index" class="ma-0">
                        <v-col :class="message.isUser ? 'text-right' : 'text-left'">
                            <MessageBubble :message="message" :isUser="message.isUser" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-flex-grow>
            <MessageInput @send="handleSendMessage" />
        </div>
    </v-container>
</template>

<script>
import ChatHeader from './ChatHeader.vue';
import MessageBubble from './MessageBubble.vue';
import MessageInput from './MessageInput.vue';

export default {
    name: 'ChatWindow',
    components: {
        ChatHeader,
        MessageBubble,
        MessageInput
    },
    data() {
        return {
            messages: [
                { text: 'Hello, how can I help you?', isUser: false },
                { text: 'I would like to know more about your services.', isUser: true }
            ]
        };
    },
    methods: {
        handleSendMessage(newMessage) {
            this.messages.push({ text: newMessage, isUser: true });

            // Simuliere eine Antwort vom Bot
            setTimeout(() => {
                this.messages.push({
                    text: 'Thank you for reaching out! We offer a range of services to meet your needs.',
                    isUser: false
                });
            }, 1000);
        }
    }
};
</script>

<style scoped>
.chat-window {
    overflow-y: auto;

}

.chat-wrapper {
    width: 800px;
    margin-left: auto;
    margin-right: auto;
}
</style>