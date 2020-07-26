const userBaseUrl = '/api/v1/user'
const postBaseUrl = '/api/v1/post'

function login(e) {
    e.preventDefault();
    localStorage.clear();
    const username = $("#username").val();
    const phone = $("#phone").val();
    $.ajax({
      type: "POST",
      url: userBaseUrl+'/login',
      data: { username , phone },
      contentType: 'application/x-www-form-urlencoded',
      success: function(data) {
        localStorage.setItem("id", data.id);
        window.location = '/post';
      },
      error: function(data) {
        $("#login_message").text(data.responseText);
        $('#login_message').css({
          "color": "red",
          "text-align": "center"
        });
      },
   });
}

function register(e) {
    e.preventDefault();
    localStorage.clear();
    const username = $("#username").val();
    const phone = $("#phone").val();
    const name = $("#name").val();
    $.ajax({
      type: "POST",
      url: userBaseUrl+'/register',
      data: { username , phone, name },
      contentType: 'application/x-www-form-urlencoded',
      success: function(data, status, xhr) {
        $("#account_creation_message").text('Account successfully created');
        $('#account_creation_message').css({
          "color": "green",
          "text-align": "center"
        });
        window.location = '/';
      },
      error: function(data) {
        $("#account_creation_message").text(data.responseText);
        $('#account_creation_message').css({
          "color": "red",
          "text-align": "center"
        });
      },
   });
}

function postDetails(e){
  e.preventDefault();
  $.ajax({
      type : 'GET',
      url : postBaseUrl + '/view',
      xhrFields : {withCredentials : true},
      success:function(data) {
        for(let i=0;i<data.length;i++){
          data[i].posted_on =  moment.utc(data[i].posted_on, 'DD-MM-YYYY HH:mm:ss').local().format('DD/MM/YYYY h:mm:ss a');
        }
        const table = $("#post").removeAttr('width').DataTable({
           scrollY:       "900px",
           scrollX:        true,
           scrollCollapse: true,
           paging:         false,
           data: data,
           columns: [{
             "data": "post"
           },
           {
              "data": "name"
            },
            {
              "data" : "posted_on"
            },
            {
              "data" : "comments"
            },
            {
              "data" : "id",
              "visible" : false
            }
          ]
        })
        $("#post tbody").on('click','td',function(){
          const data = (table.row( this ).data());
          localStorage.setItem("post", JSON.stringify(data));
          window.location = '/view_comment';
        })
      },
      error:function(data) {
        $("#post_message").text(data.responseText);
        $('#post_message').css({
          "display": "flex",
          "justify-content": "center",
          "color": "red",
          "font-size": "larger"
        })  
      }
    })
}

function commentDetails(e){
  e.preventDefault();
  const post = JSON.parse(localStorage.getItem('post'));
  $.ajax({
      type : 'GET',
      url : postBaseUrl + `/comment/${post.id}`,
      xhrFields : {withCredentials : true},
      success:function(data) {
        for(let i=0;i<data.length;i++){
          data[i].commented_on =  moment.utc(data[i].commented_on, 'DD-MM-YYYY HH:mm:ss').local().format('DD/MM/YYYY h:mm:ss a');
        }
        const table = $("#comment").removeAttr('width').DataTable({
           scrollY:       "900px",
           scrollX:        true,
           scrollCollapse: true,
           paging:         false,
           data: data,
           columns: [{
             "data": "comment"
           },
           {
              "data": "name"
            },
            {
              "data" : "commented_on"
            },
          ]
        })
      },
      error:function(data) {
        $("#comment_message").text(data.responseText);
        $('#comment_message').css({
          "display": "flex",
          "justify-content": "center",
          "color": "red",
          "font-size": "larger"
        })  
      }
    })
}

function add_post(e){
  e.preventDefault();
  const post = $("#post").val();
  $.ajax({
      type: "POST",
      url: postBaseUrl+'/create',
      xhrFields : {withCredentials : true},
      data: { post, id : localStorage.getItem('id') },
      contentType: 'application/x-www-form-urlencoded',
      success: function(data, status, xhr) {
         $("#new_post_message").text('Post successfully created');
        $('#new_post_message').css({
          "color": "green",
          "text-align": "center"
        });
      },
      error: function(data) {
        $("#new_post_message").text(data.responseText);
        $('#new_post_message').css({
          "color": "red",
          "text-align": "center"
        });
      },
   });
}

function add_comment(e){
  e.preventDefault();
  const comment = $("#comment").val();
  const post = JSON.parse(localStorage.getItem('post'));
  $.ajax({
      type: "POST",
      url: postBaseUrl+'/comment',
      data: { postid : post.id, comment, id : localStorage.getItem('id') },
      xhrFields : {withCredentials : true},
      contentType: 'application/x-www-form-urlencoded',
      success: function(data, status, xhr) {
         $("#new_comment_message").text('Comment successfully added');
        $('#new_comment_message').css({
          "color": "green",
          "text-align": "center"
        });
      },
      error: function(data) {
        $("#new_comment_message").text(data.responseText);
        $('#new_comment_message').css({
          "color": "red",
          "text-align": "center"
        });
      },
   });
}