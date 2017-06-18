$('#send').click(function(event){
    event.preventDefault();
    var inp = $('#chat-msg').val();

    $.ajax({
        url: '/post/',
        type: 'POST',
        data: {'mssg': inp},
        success: function(data){
            $('#chat-msg').val("");
            if(data.user){
                console.log(data.user + '> ' + data.mssg );
                $('#msg-list').append("<li class = 'text-right list-group-item'>" + data.mssg + "</li>");
            }
            //var charlist = document.getElementById('msg-list-div');
            //charlist.scrollTop = charlist.scrollHeight;
            //alert(data.user);
        }
    });
});

function getMessage(){

    $('#msg-list-div').on('scroll',function(){
        console.log('scrolling!!!!!!!!');
        scrolling = true;
    });

    if(!scrolling){
        $.get('/messages/',function(messages){
            $('#msg-list').html(messages);
            console.log('>>>>>>>>>>>>get_message');
        });
    }
    scrolling = false;
}

var scrolling = false;

setInterval(getMessage, 500);


// Takes care of csrf token form JavaScript Side
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
