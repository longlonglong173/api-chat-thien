const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const ConversationRoom = require('../../models/ConversationRoom');
const { v4: uuidv4 } = require('uuid');
const { io } = require('../../index');

// SOCKET IO
const chats = io.of('/chats');
chats.on('connection', (socket) => {
    console.log('Socket is connection...', socket.id);
    const room_id = socket.handshake.query.room_id;
    socket.join(room_id);
    console.log('user joined room #' + room_id);

    socket.on('disconnect', function() {
        socket.leave(room_id);
        console.log('user disconnected');
    });

    socket.on('sendMessage', async(req) => {
        try {
            // console.log('send message');
            const reqConversationId = req.conversation_id || null;
            const reqSenderId = req.sender_id || null;
            const reqToken = req.token || null;
            const reqPartnerId = req.partner_id || null;
            const reqMessage = req.message || '';
            const reqIndex = req.index ? req.index : 0;
            const reqCount = req.count ? req.count : 20;
            const user = await User.findOne({
                token: reqToken,
            });
            const partner = await User.findOne({
                id: reqPartnerId,
            });
            let room = await ConversationRoom.findOne({
                conversation_id: reqConversationId,
            }).exec();
            if (room == null) {
                room = await ConversationRoom.findOne({
                    member_id: {
                        $all: [user.id, partner.id],
                    },
                }).exec();
            }
            // const userList = await User.find();
            if (reqMessage === '') {
                chats.to(room_id).emit('receiveResult', {
                    code: 1004,
                    message: 'Parameter value is invalid.',
                });
            } else {
                if (socket.handshake.query.room_id == null || room == null) {
                    // 2 người mới nhắn tin với nhau: => tạo room mới
                    const messageId = uuidv4();
                    const createdAt = Date.now();
                    const newRoom = new ConversationRoom({
                        conversation_id: uuidv4(),
                        member_id: [user.id, partner.id],
                        messageList: [{
                            id: messageId,
                            uuid: user.id,
                            message: reqMessage,
                            createdAt: createdAt,
                            unread: 1,
                        }, ],
                    });
                    await newRoom.save();
                    let isPartnerBlockedUser = false;
                    if (partner.blocked.length > 0) {
                        isPartnerBlockedUser = partner.blocked.includes(
                            user.id
                        );
                    }
                    chats.emit('receiveResult', {
                        code: 1000,
                        message: 'OK',
                        data: {
                            user_id: user.id,
                            partner_id: reqPartnerId,
                            message: reqMessage,
                            message_id: messageId,
                            unread: 1,
                            created: createdAt,
                            sender: {
                                id: user.id,
                                username: user.username,
                                avatar: user.avatar,
                            },
                        },
                        is_blocked: isPartnerBlockedUser,
                    });
                } else {
                    const messageId = uuidv4();
                    const createdAt = Date.now();
                    room.messageList.push({
                        id: messageId,
                        uuid: user.id,
                        message: reqMessage,
                        createdAt: createdAt,
                        unread: 1,
                    });
                    await room.save();
                    let isPartnerBlockedUser = false;
                    if (partner.blocked.length > 0) {
                        isPartnerBlockedUser = partner.blocked.includes(
                            user.id
                        );
                    }

                    chats.to(room_id).emit('receiveResult', {
                        code: 1000,
                        message: 'OK',
                        data: {
                            user_id: user.id,
                            partner_id: partner.id,
                            message: reqMessage,
                            message_id: messageId,
                            unread: 1,
                            created: createdAt,
                            sender: {
                                id: user.id,
                                username: user.username,
                                avatar: user.avatar,
                            },
                        },
                        is_blocked: isPartnerBlockedUser,
                    });
                }
            }
        } catch (err) {
            console.log('err');
            // console.log(req);
            chats.to(room_id).emit('receiveResult', { message: err });
        }
    });
});

module.exports = router;