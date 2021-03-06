var Discord = require('discord.js');
var token = require('../info/settings.json');
var fs = require('fs');


const {
    Client,
    MessageEmbed,
    DMChannel
} = require('discord.js');

// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    // If the message is "how to embed"
    if (message.author.bot) return;

    console.log("got message!")
    if (message.channel.type == "dm") {
        var messageSplit = message.content.split(" ");
        if (messageSplit[0] == "!activate") {
            // activating key
            console.log("got activate!")

            if (messageSplit.length != 2) {
                // wrong format
                console.log("wrong format!")
                return
            }
            var key = messageSplit[1]
            analyzeKey(message, key);

        } else if (messageSplit[0] == "!deactivate") {
            // deactivating key
            if (messageSplit.length != 2) {
                // wrong format
                console.log("wrong format!")
                return
            }
            var key = messageSplit[1]
            deactivateKey(message, key)
        } else if (messageSplit[0] == "!help") {
            // help
            displayHelp(message)
        }

    }
});

function analyzeKey(message, key) {
    fs.readFile(__dirname + "/../info/users.json", function (err, data) {
        if (err) {
            console.log(err)
        }

        var json = JSON.parse(data);
        // console.log(json)
        var keyFound = false
        for (var i = 0; i < Object.keys(json).length; i++) {
            var cKey = Object.keys(json)[i]
            console.log(cKey)
            if (cKey == key) {
                console.log("key found!")
                keyFound = true;

                if (json[cKey] == "none") {
                    // bind discord here
                    json[cKey] = message.author.tag;
                    fs.writeFile(__dirname + "/../info/users.json", JSON.stringify(json), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    message.channel.send({
                        embed: {
                            color: 0x00ff00,
                            description: "Activated!"
                        }
                    });
                } else {
                    console.log("key already in use")

                    message.channel.send({
                        embed: {
                            color: 0xff0000,
                            description: "Key already in use!"
                        }
                    });
                    return
                }
            }
        }
        if (!keyFound) {
            // key invalid
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    description: "Key not found!"
                }
            });
            return
        }

    })
}

function displayHelp(message) {
    message.channel.send({
        embed: {
            color: 0x00ff00,
            description: "Usage: !activate <<key>> or !deactivate <<key>>"
        }
    });
    return
}

function deactivateKey(message, key) {
    console.log("deactivate key called")
    fs.readFile(__dirname + "/../info/users.json", function (err, data) {
        if (err) {
            console.log(err)
        }

        var json = JSON.parse(data);
        // console.log(json)
        var keyFound = false
        for (var i = 0; i < Object.keys(json).length; i++) {
            var cKey = Object.keys(json)[i]
            console.log(cKey)
            if (cKey == key) {
                console.log("key found!")
                keyFound = true;

                if (json[cKey] == "none") {
                    // key already unbound 

                    message.channel.send({
                        embed: {
                            color: 0x00ff00,
                            description: "Key is already deactivated!"
                        }
                    });
                    return
                } else {
                    // check if key is the user's 
                    if (json[cKey] != message.author.tag) {
                        message.channel.send({
                            embed: {
                                color: 0xff0000,
                                description: "Cannot unbind a key that is not yours!"
                            }
                        });
                        return
                    }
                    json[cKey] = "none";
                    fs.writeFile(__dirname + "/../info/users.json", JSON.stringify(json), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    message.channel.send({
                        embed: {
                            color: 0x00ff00,
                            description: "Key deactivated!"
                        }
                    });
                    return
                }
            }
        }
        if (!keyFound) {
            // key invalid
            message.channel.send({
                embed: {
                    color: 0xff0000,
                    description: "Key not found!"
                }
            });
            return
        }

    })
}


// Log your bot in using the token from https://discordapp.com/developers/applications/me
fs.readFile(__dirname + "/../info/settings.json", function (err, data) {
    if (err) {
        console.log(err)
        return;
    }
    let json = JSON.parse(data);
    console.log(json["token"]);
    client.login(json["token"])
})