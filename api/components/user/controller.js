const { nanoid } = require('nanoid');
const auth = require('../auth');

const TABLA = 'user';

module.exports = (injectedStore, injectedCache) => {
    let store = injectedStore;
    let cache = injectedCache;
    if (!store) {
        store = require('../../../store/dummy');     
    }
    if (!cache) {
        cache = require('../../../store/dummy');
    }

    const list = async () => {
        let users = await cache.list(TABLA);

        if (!users) {
            console.log('No estaba en cache');
            users = await store.list(TABLA);
            cache.upsert(TABLA, users);
        } else {
            console.log('Estaba en cache');
        }

        return users;
    }

    const get = (id) => {
        return store.get(TABLA, id);
    }

    const upsert =  async (body) => {
        const user = {
            name: body.name,
            username: body.username,
        }

        if (body.id) {
            user.id = body.id;
        } else {
            user.id = nanoid();
        }

        if (body.password || body.username ) {
            await auth.upsert({
                id: user.id,
                username: user.username,
                password: body.password,
            });
        }

        store.upsert(TABLA, user);

        return user;
    }

    const remove = (id) => {
        return store.remove(TABLA, id);
    }

    const follow = (from, to) => {
        return store.upsert(TABLA + '_follow', {
            user_from: from,
            user_to: to,
        })
    }

    const followers = async (id) => {
        return await store.listFollowers(TABLA + '_follow', { user_to:id } );
    }

    return {
        list,
        get,
        upsert,
        remove,
        follow,
        followers
    }
}