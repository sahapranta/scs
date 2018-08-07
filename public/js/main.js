// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
$('document').ready(function(){
//menu function toggle 
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#'+burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });

    //modal function
    function toggleModalClasses(event) {
        var modalId = event.currentTarget.dataset.modalId;
        var modal = $(modalId);
        modal.toggleClass('is-active');
        $('html').toggleClass('is-clipped');
    };
    
    $('.open-modal').click(toggleModalClasses);
    
    $('.close-modal').click(toggleModalClasses);

    //dropdown
    var dropdown = $('#dropdown');
    var notification = $('#notification');

    notification.on('click', function(){
        // alert();
        dropdown.toggleClass('.is-open');
    });
$('.menu-list li').on('hover', function(){
    $('.menu-list li a').toggleClass('.is-active');
});
   
    var localStorageAPI = {
        isSupported: function() {
            return window.localStorage;
        },
     
        setItem: function(key, value) {
            return localStorage.setItem(key, value);
        },
     
        getItem: function(key) {
            return localStorage.getItem(key);
        },
        setObject: function(key, object) {
            return localStorage.setItem(key, JSON.stringify(object));
        },
     
        getObject: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },
     
        removeItem: function(key) {
            return localStorage.removeItem(key);
        },
     
        clearAll: function() {
            return localStorage.clear();
        }
     
    };

        $("#mealSubmit").on('click', function(){
            $('.mealForm').each(function(){
                var valuesToSend = $(this).serialize();
                $.ajax($(this).attr('action'), {
                    method:$(this).attr('method'),
                    data:valuesToSend,
                    error: function(jqXHR) { 
                        if(jqXHR.status==0) {
                            alert(" fail to connect, please check your connection!");
                        }
                    },
                    success: function() {
                        alert("The Meals has been successfully saved.");
                    }
                });
            });
        });

        $("#mealReset").on('click', function(){
            $('.mealForm').trigger("reset");
        });

        $(".devDelete").on('click', function(){
           var ans = confirm('Please Think again!, You want to delete the Record!');
           if(ans === true){
               var answer = prompt("Are you Sure! hints:yes");
               if(answer == 'yes'){
                    $.ajax(`/devotee/delete/${$(this).attr('data-id')}?_method=DELETE`, {
                        type:"POST",
                        success: function() {
                            alert("The Record has been successfully Deleted.");
                            $('#devTabLoad').load(' #devTabLoad');
                        }
                    });
               }          
            
           }else{
               alert("Thanks for not deleting me!");
           }
        });
        

        $(".devEdit").on('click', function(event){
            var modalId = event.currentTarget.dataset.modalId;
            var modal = $(modalId);
            var dataId =$(this).attr('data-id')
            modal.find('.edit-name').val($(this).closest('tr').find('td a').text());
            modal.find('.edit-num').val($(this).closest('tr').find('td span').text());
            modal.find('form').attr('action', `/devotee/edit/${dataId}?_method=PUT`);
            modal.toggleClass('is-active');
            $('html').toggleClass('is-clipped');            
        });

        $('#editForm').submit(function(e){
            e.preventDefault();
            var valuesToSend = $(this).serialize();
            $.ajax( $(this).attr('action') , {
                type:"POST",
                data:valuesToSend,
                success: function() {
                    alert("The Record has been successfully Updated.");
                    $('#devTabLoad').load(' #devTabLoad');
                }
            });
        });

        // $("input[type='date']").val(new Date().toDateInputValue());
        $('.default-date').val(new Date().toISOString().substr(0, 10));

        $('.deposit-modal').on('click', function(){
            var modalId = event.currentTarget.dataset.modalId;
            var modal = $(modalId);
            var dataId =$(this).attr('data-id')
            modal.find('.deposit-name').text($(this).closest('tr').find('td a').text());
            modal.find('form').attr('action', `/deposit/${dataId}`);
            modal.toggleClass('is-active');
            $('html').toggleClass('is-clipped');      
        });

        $('#depositForm').submit(function(e){
            e.preventDefault();
            var valuesToSend = $(this).serialize();
            $.ajax( $(this).attr('action') , {
                type:"POST",
                data:valuesToSend,
                success: function() {
                    alert("The Record has been successfully Updated.");
                    $('.load').load(' .load');
                }
            });
        });

        $('.view-all').on('click', function(){
            $('#depoTab').toggleClass('is-folded');
        });

       

        $('#print')
        .attr( "href", "javascript:void( 0 )" )
        .click(function(){
                $( "#monthlyChart" ).print();
                return( false );
            }
        );

        $(".userDel").on('click', function(){
            var ans = confirm('Please Think again!, You want to delete the Record!');
            if(ans === true){
                var answer = prompt("Are you Sure! hints:yes");
                if(answer == 'yes'){
                     $.ajax(`/user/delete/${$(this).parent().attr('data-id')}?_method=DELETE`, {
                         type:"POST",
                         success: function() {
                             alert("The Record has been successfully Deleted.");
                             $('#userLoad').load(' #userLoad');
                         }
                     });
                }          
             
            }else{
                alert("Thanks for not deleting me!");
            }
        });

        $(".switch").on('change', function(){
            $.ajax(`/user/admin/${$(this).parent().prev().attr('data-id')}?_method=PUT`, {
                type:"POST",
                success:function(){
                    alert(`Welcome ${$(this).parent().prev().prev().text()}, You are now Admin`);
                    $('#userLoad').load(' #userLoad');
                }
            });
        });

        $('.user-modal').on('click', function(){
            var name = $(this).parent().prev().text();
            var modalId = event.currentTarget.dataset.modalId;
            var modal = $(modalId);
            var dataId =$(this).parent().attr('data-id');
            modal.find('input:text').val(name);
            modal.find('.user-name').text(name);
            modal.find('form').attr('action', `/user/edit/${dataId}`);
            modal.toggleClass('is-active');
            $('html').toggleClass('is-clipped');      
        });

        $('#userForm').submit(function(e){
            e.preventDefault();
            var valuesToSend = $(this).serialize();
            $.ajax( $(this).attr('action') , {
                type:"POST",
                data:valuesToSend,
                success: function() {
                    alert("The Record has been successfully Updated.");
                    $('.userLoad').load(' .userLoad');
                }
            });
        });

        $(".bugDel").on('click', function(){
            var ans = confirm('Please Think again!, You want to delete the Record!');
            if(ans === true){
                var answer = prompt("Are you Sure! hints:yes");
                if(answer == 'yes'){
                     $.ajax(`/bug/delete/${$(this).attr('data-id')}?_method=DELETE`, {
                         type:"POST",
                         success: function() {
                             alert("The Record has been successfully Deleted.");
                             $('body').load(' body');
                         }
                     });
                }          
             
            }else{
                alert("Thanks for not deleting me!");
            }
        });
        
});
//side Nav
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

//Notification
window.setTimeout(function() {
    $(".notification").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
  }, 3500);

  jQuery.fn.print = function(){
    var strFrameName = (`printer-${(new Date()).getTime()}`);
    var jFrame = $( `<iframe name="${strFrameName}" >`);
    jFrame
        .css( "width", "1px" )
        .css( "height", "1px" )
        .css( "position", "absolute" )
        .css( "left", "-9999px" )
        .appendTo( $( "body:first" ) )
    ;
    var objFrame = window.frames[ strFrameName ];
    var objDoc = objFrame.document;
    var jStyleDiv = $( "<div>" ).append( $( "style" ).clone() );
    objDoc.open();
    objDoc.write( "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" );
    objDoc.write( "<html>" );
    objDoc.write( $('head').html() );
    objDoc.write( "<body>" );
    objDoc.write( "<head>" );
    objDoc.write( "<title>" );
    objDoc.write( document.title );
    objDoc.write( "</title>" );
    objDoc.write( jStyleDiv.html() );
    objDoc.write( "</head>" );
    objDoc.write($('.info-tiles').html());
    objDoc.write( this.html() );
    objDoc.write( "</body>" );
    objDoc.write( "</html>" );
    objDoc.close();
    objFrame.focus();
    objFrame.print();
    setTimeout(function(){jFrame.remove(); }, (60 * 1000));
}