class Chat {
  constructor(id) {
    this.id = id;
    this.state = 'activo';
    this.enabledDisabled = '';
    this.content = '';
    this.timeout = '';
  }

  /**
   * Create a new pair of chats inside $container, wrapped by <chat></chat>
   *
   * Chat's id is automatically generated based on chatsData.numChats
   *
   * @param {Object} chatsData
   * @param {jQueryObject} $container
   */
  static createPair(chatsData, $container) {
    // Create a new pair of chats
    const chat1 = new Chat(++chatsData.numChats);
    const chat2 = new Chat(++chatsData.numChats);
    const $chatPair = $(document.createElement('chat')).addClass('row');
    $chatPair.append(chat1.render()).append(chat2.render());

    // Insert the pair into the container
    $container.append($chatPair);

    // Prepare chats to auto logout themselves
    chat1.countdown();
    chat2.countdown();

    // Keep track of new chats
    chatsData.chats.push(chat1, chat2);

    $('aside').find('h4').text('Logout en 5 segundos');
  }

  /**
   * Force logout of all existing chats
   *
   * @param {Object} chatsData
   */
  static forceLogout(chatsData) {
    for (const chat of chatsData.chats) {
      chat.logout(true);
    }
  }

  /**
   * Return HTML template with data of this chat
   */
  render() {
    return `
    <div class="column" style="background-color:#ddd;">
        <h3>Chat ${this.id}</h3>
        <textarea name="chat-${this.id}" class="chat" ${this.enabledDisabled} >${this.content}</textarea>
        <h4 class="${this.state}">Chat ${this.state}</h4>
    </div>
    `;
  }

  /**
   * Disable this chat and notify if is automatic logout
   *
   * @param {boolean} force Determine if logout is automatic or forced
   */
  logout(force = false) {
    // Get this chat
    const $chat = $(`textarea[name="chat-${this.id}"]`);

    // Change props and render again
    this.state = 'inactivo';
    this.enabledDisabled = 'disabled';

    $chat.parent().replaceWith(this.render());
    clearTimeout(this.timeout);

    if (!force) {
      $('aside').find('h4').text('Logout automático');
      this.notifyLogout();
    }
  }

  /**
   * Prepare this chat to be automatically logout after 5 seconds
   *
   * If user write in this chat, countdown will be reseted
   */
  countdown() {
    // Get this chat
    const $chat = $(`textarea[name="chat-${this.id}"]`);

    this.timeout = setTimeout(() => {
      // Logout after 5 seconds
      this.logout();
    }, 5000);

    $chat.keyup((event) => {
      // If user write, clear timeout and restart countdown
      clearTimeout(this.timeout);
      this.countdown();

      // Save content to prevent lost of data when logout
      this.content = $chat.val();
    });
  }

  /**
   * Notify user about wich chat has been disabled
   */
  notifyLogout() {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      alert('Este navegador no soporta las notificaciones JavaScript');
    }

    // If browser supports notifications and we didn't ask for permission, ask now
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // If we have permission, notify the logout
    if (Notification.permission === 'granted') {
      let notification = new Notification(`El chat ${this.id} ha caducado`);
    }
  }
}

export { Chat };
