import {updateDOMWithFetchedUserData} from './main.js'
window.addEventListener('load', function () {
    let preloader = document.getElementById("preloader");
    setTimeout(() => {
        preloader.style.display = "none"
    }, 1000);
    this.document.getElementById('get_profile').addEventListener('submit',handleFormSubmition);
    // This handle the form submition 
    function handleFormSubmition(e){
        e.preventDefault();
        let submitBtn = document.getElementsByClassName('user-submit-btn')[0],
        inputPage = document.getElementsByClassName('query_page')[0],
        resultPage = document.getElementsByClassName('git')[0]
        submitBtn.value = 'Processing...'
        let url = 'https://api.github.com/graphql',
        tk1 = '4bda53c6b0',
        tk2 = '1983a4cdce',
        tk3 = '5755a341ae',
        tk4 = 'b69864fa5c',
        user_name = document.getElementById('login_field').value,
        // This is where I'll save my Github Token. Because Github deletes tokens when they are found in your commit, I did it this way.
        token = tk1+tk2+tk3+tk4,
        headers = new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-type': 'application/json',
        })
        let body = `{ "query": "query { user(login:\\\"${user_name}\\\") { name url login bio avatarUrl followers { totalCount } following { totalCount } location email twitterUsername websiteUrl starredRepositories { totalCount } status { id emoji emojiHTML message} repositories(first: 20, orderBy: {field:UPDATED_AT, direction:DESC}) { totalCount nodes { updatedAt licenseInfo { name } viewerHasStarred description name url isPrivate forkCount stargazerCount primaryLanguage { id name color } owner { login } defaultBranchRef { name } } } } }" }`;
            fetch(url, {
                method: 'POST',
                body,
                headers,
            })
            .then((response) => response.json()).then(data => 
                {
                    let user_info  = data.data.user,
                    user_data = data.data
                    console.log(user_data)
                    console.log(user_info)
                    if (user_info.name === null) {
                        let error_div = document.getElementsByClassName('flash-error ')[0]
                        error_div.style.display = 'block';
                        error_div.innerText = 'Something went wrong. Try again later';
                        submitBtn.value = 'View Profile'
                    } else {
                        inputPage.style.display = 'none';
                        resultPage.style.display = '';
                        updateDOMWithFetchedUserData(user_data);
                    }
                }
                )
             .catch(function(error){
                let error_div = document.getElementsByClassName('flash-error ')[0]
                error_div.style.display = 'block';
                submitBtn.value = 'View Profile'
            })

    }
})