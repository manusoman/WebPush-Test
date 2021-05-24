// My own implementation of JavaScript Promise.
// Hence the name 'Probably'.
// This should 'Probably' work.

function Probably(handler) {
    this.state = 'pending';
    this.handler = handler;

    this.res = null;
    this.rej = null;
    this.fin_func = null;

    this.execute();
}

Probably.prototype = {
    constructor : Probably,

    _res : function() {
        return (val) => {
            this.res && this.res(val);
            this.value = val;
            this.state = 'fulfilled';
            this.fin_func && this.fin_func();
        };
    },

    _rej : function() {
        return (err) => {
            this.rej && this.rej(err);
            this.reason = err;
            this.state = 'rejected';
            this.fin_func && this.fin_func();
        };
    },

    then : function(res, rej) {
        if(res && typeof(res) === 'function') {
            if(this.value) {
                res(this.value);
            } else {
                this.res = res;
            }
        }

        rej && this.catch(rej);
        return this;
    },

    catch : function(rej) {
        if(rej && typeof(rej) === 'function'){
            if(this.reason) {
                res(this.reason);
            } else {
                this.rej = rej;
            }
        }

        return this;
    },

    finally : function(func) {
        if(func && typeof(func) === 'function'){
            if(this.state !== 'pending') {
                func();
            } else {
                this.fin_func = func;
            }
        }
    },

    execute : function() {
        this.handler(this._res(), this._rej());
    }
};