/**
 * Copyright (c) 2014, Wanqiang Xia. All rights reserved.
 *
 * This program is open source software: you can redistribute it and/or
 * modify it under the terms of the BSD 2-Clause license.
 *
 * This program is a javascript implementation of QP framework. You can visit QP
 * website (http://www.state-machine.com) for more information
 */

var util = require('util'),
    QHsm = require('./QHsm').QHsm;

/**
 * QActive, defines the active object
 */
var QActive = function(initial) {
    var eventQueue = [],
        deferQueue = [];

    this.run = function() {
        var e = this.getEvent();

        if (e != null) {
            this.dispatch(e);
        }
    };

    this.schedule = function() {
        setImmediate(function() {
            this.run();
        }.bind(this));
    };

    this.postFifo = function(e) {
        eventQueue.push(e);
        this.schedule();
    };

    this.postLifo = function(e) {
        eventQueue.unshift(e);
        this.schedule();
    };

    this.getEvent = function() {
        var result = null;

        if (eventQueue.length !== 0) {
            result = eventQueue.shift();
        }

        return result;
    };

    this.defer = function(e) {
        deferQueue.push(e);
    };

    this.recall = function() {
        var i = 0,
            length = deferQueue.length;

        for (i = 0; i < length; i++) {
            eventQueue.push(deferQueue[i]);
            this.schedule();
        }

        deferQueue = [];

        return length > 0;
    };



    this.priority = 0;
    QHsm.call(this, initial);
};

util.inherits(QActive, QHsm);

module.exports = QActive;