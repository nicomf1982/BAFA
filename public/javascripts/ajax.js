$(document).ready( function() {	// Esta parte del código se ejecutará automáticamente cuando la página esté lista.

$("#login").validate({
  submitHandler: function(form) {
    //alert(form);
    $(form).ajaxSubmit({
      success:function(res,status){
        if (res===true){
          alert('success login');
        }else{
          alert('bad login');
        }
      },
      error: function (res,status,xhr){alert('error, intentelo nuevamente');}
    });
  }
});

$("#register").validate({
  submitHandler: function(form) {
    //alert(form);
    $(form).ajaxSubmit({
      success:function(res,status){
        if (res===true){
          alert('succes register');
        }else{
          alert('bad register');
        }
      },
      error: function (res,status,xhr){alert('error, intentelo nuevamente');}
    });
  }
});


});