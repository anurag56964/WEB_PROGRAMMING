const fs = require("fs");

let posts = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/posts.json", (err, postData) => {
            if (err) {
                reject("Unable to read file posts.json");
            } else {

                posts = JSON.parse(postData);

                fs.readFile("./data/categories.json", (err, categoryData) => {
                    if (err) {
                        reject("Unable to read ");
                    } else {
                        categories = JSON.parse(categoryData);
                        resolve("operation  success");
                    }
                });
            }
        });
    });
}

function getAllPosts() {
    return new Promise((resolve, reject) => {
        if (posts.length == 0) {
            reject("no results ");
        } else {
            resolve(posts);
        }
    });
}

function getPublishedPosts() {
    return new Promise((resolve, reject) => {
        const PublishedPosts = posts.filter((post) => post.published === true);

        if (PublishedPosts.length === 0) {
            reject("No results ");
        } else {
            resolve(PublishedPosts);
        }
    });
}

function getPublishedPostsByCategory(category) {
    return new Promise((resolve, reject) => {

        const publishedPostsByCategory = posts.filter((post) => post.published === true && post.category === category);

        if (publishedPostsByCategory.length === 0) {
            reject("No results ");
        } else {
            resolve(publishedPostsByCategory);
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length === 0) {
            reject("no results ");
        } else {
            resolve(categories);
        }
    });
}

function addPost(postData) {
    return new Promise((resolve, reject) => {


        if (postData.published === undefined) {

            postData.published = false;
        }


        else {
            postData.published = true;
        }

        const currentDate = new Date();

        const year = currentDate.getFullYear();



        const month = currentDate.getMonth() + 1;

        const day = currentDate.getDate();




        const formattedDate = `${year}-${month}-${day}`;

        postData.postDate = formattedDate;

        posts.push(postData);



        resolve(postData);
    });
}

function getPostsByCategory(category) {

    return new Promise((resolve, reject) => {

        const PostsFil = posts.filter((post) => post.category == category);

        if (PostsFil.length === 0) {

            reject('No result returned');

        } else {
            resolve(PostsFil);
        }
    });
}

function getPostsByMinDate(minDateStr) {

    return new Promise((resolve, reject) => {



        const dateMin = new Date(minDateStr);

        const PostsFil = posts.filter((post) => new Date(post.postDate) >= dateMin);

        if (PostsFil.length === 0) {

            reject("no results ");
        } else {
            resolve(PostsFil);
        }
    });
}

function getPostById(id) {
    return new Promise((resolve, reject) => {


        const post = posts.find((post) => post.id === parseInt(id));

        if (!post) {


            reject("no result returned");
        } else {
            resolve(post);
        }
    });
}

module.exports = {
    initialize,
    getAllPosts,
    getPublishedPosts,
    getPublishedPostsByCategory,
    getCategories,
    addPost,
    getPostsByCategory,
    getPostsByMinDate,
    getPostById,
};
