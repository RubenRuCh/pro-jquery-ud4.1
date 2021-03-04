import { Chat } from './Chat.js';

$(() => {
  // Objet to keep info about the chats created
  const chatsData = {
    numChats: 0,
    chats: [],
  };

  // Clean $chats container
  const $chats = $('chats');
  $chats.html('');

  // Create 2 initial chats
  Chat.createPair(chatsData, $chats);

  // Conf aside button.logout to force logout of all chats
  const $aside = $('aside');
  $aside.find('button.logout').click((event) => {
    event.preventDefault();
    Chat.forceLogout(chatsData);
  });

  // Conf aside last button to allow the creation of a new pair of chats
  $aside
    .find('button')
    .last()
    .click((event) => {
      event.preventDefault();
      Chat.createPair(chatsData, $chats);
    });
});
