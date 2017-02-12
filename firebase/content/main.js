/*
    *author: Phạm Huy Hùng
    *todo: just a fucking pet project to improve front-end skill, using ajax jquery and firebase database, microsoft's webservice
    */
 //firebase realtime database configuration
const config = {
            apiKey: "AIzaSyA9s228upzoBn9JbtnOKxvWxV44vJZa0fw",
            authDomain: "facereg-805ec.firebaseapp.com",
            databaseURL: "https://facereg-805ec.firebaseio.com",
            storageBucket: "facereg-805ec.appspot.com",
            messagingSenderId: "167918342485"
        };
        firebase.initializeApp(config);
        var database= firebase.database().ref().child('tblhtml');
            var dataresult=database.limitToLast(4);
            dataresult.on('value', function (snapshot){
                
               var finalresult=snapshot.val(); 
               
               //console.log(finalresult);
            $('#photosucess').empty();
            var maxlength=finalresult.length;
       var sta=0;
       var element_per_page=4;
       var limit=element_per_page;
                $.each(finalresult, function(i=sta){
                //lấy khóa của object
                var getkeys=Object.keys(finalresult[i]);
                
                var getdata=finalresult[i];
                //console.log(finalresult[i]);
                $('#photosucess').append('<li class="col-xs-3" id="childnode" onclick=xem('+JSON.stringify(finalresult[i])+');><div class="jumbotron"><a><img src="'+finalresult[i].content+'" style="max-height:100%;max-width:100%;"/></a></div></li>')
            
        });
            
       
        });
//imgur api callback
    function previewfile(){
        $('#waiting').show();
        var filesSelected = document.getElementById("inputFile").files;
        if(filesSelected.length>0){
            var filetoload=filesSelected[0];
            var filreader= new FileReader();
            filreader.onload=function(fileloadevent){
                var scrdata= fileloadevent.target.result;
                var binarystring= btoa(scrdata);
                    var sexybody=binarystring;
                    
                        $.ajax({
                        url:"https://api.imgur.com/3/upload",
                        beforeSend:function(objectxhr){
                            objectxhr.setRequestHeader("Authorization","Client-ID 8b61597c15b73ac");
                        },
                        type: "POST",
                        contentType:"multipart/form-data",
                        data:sexybody
                    }).done(function(res){
                        $('#waiting').hide();
                        document.getElementById('txtimage').value=res.data["link"];
                    })
                    .fail(function(){
                            $('#waiting').hide();
                        alert("không thể tải lên tệp ảnh, giới hạn ảnh là 10mb");
                    });
            }
            filreader.readAsBinaryString(filetoload);
        }
    }
    var app = angular.module("myApp", []);
            app.controller('myCtrl', function($scope, $http) {
                

    $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
        $.material.init();
        
        
        $('#btnclear').click(function(){
            $('#txtimage').val("");
        });
        $('#btnsubmit').click(function(){
            $('#info').empty();
            
 $(function() {
     $('#loadingimg').show();
     //cognitive computervision api callback
     var combody='{"url":"'+$('#txtimage').val()+'"}';
     var comparams={
         "visualFeatures":"Adult"
     }
      $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(comparams),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a289100a0aac4fe492ac24fbe214bbf6");
            },
            type: "POST",
            contentType: "json",
            // Request body
            data: combody
        })
        .done(function(data) {
            if(data.adult["isAdultContent"]==true){
                alert("ảnh chứa nội dung nhạy cảm, không thể nhận diện")
            }
            else{
//cognitive faceapi service callback
        var body='{"url":"'+$('#txtimage').val()+'"}';
        var params = {
            // Request parameters
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "age,gender,smile",
        };
      
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/face/v1.0/detect?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","b254d42159384d3ea0fb98d0da103f30");
            },
            type: "POST",
            contentType: "json",
            // Request body
            data: body
        })
        .done(function(response) {
            $('#loadingimg').hide();
            $('#info').append('<img id="photo" style="position: absolute;" src="'+$('#txtimage').val()+'" />');
            //$('#info').css({"background-image":"url('"+$('#txtimage').val()+"');", "background-size":"contain;","background-repeat":"no-repeat;", "width":"100%","height":"0"});
            //alert("thành công");
            $scope.res=response;
            $.each(response, function(i){
                //console.log(response[i]);
                $('#info').append('<p> tuổi: '+response[i].faceAttributes["age"]+'</p>giới tính: '+response[i].faceAttributes["gender"]+'</p>');
                $('#info').append('<a style="border: 2px solid red; width: '+response[i].faceRectangle["width"]+'px; height:'+response[i].faceRectangle["height"]+'px; top: '+response[i].faceRectangle["top"]+'px; left:'+response[i].faceRectangle["left"]+'px; position: absolute;" data-toggle="tooltip" data-placement="top" title="tuổi: '+response[i].faceAttributes["age"]+'"></a>');
                
            });
            
            if(response.length==0){
                alert("không tìm thấy mặt người trong ảnh");
            }
            else{
                //save data in firebase realtime database
     try
        {
             var newpost=database.push();
             newpost.set({
             content: $('#txtimage').val(),
             jsonobject: response
             });
        }
        catch(err){
            console.log(err.message);
        }
            }
        })
        .fail(function() {
            $('#loadingimg').hide();
            alert("đường dẫn ảnh không hợp lệ");
        });
            }
        })
        .fail(function() {
            $('#loadingimg').hide();
            alert("vui lòng chọn tải ảnh hoặc dán đường dẫn ảnh");
        });
     });
    });
    });
});
//sự kiện mở window
function xem(jsonparam){
    var getit=jsonparam.jsonobject;
    //console.log(getit);
    var temp="<div></div>";
    $('#info').empty();
     $('#info').append('<div style="position: relative;"><img style="position: absolute;" src="'+jsonparam.content+'" /></div>');
    $.each(getit, function(i){
        //console.log(getit[i].faceAttributes);
       $('#info').append('<a style="border: 2px solid red; width: '+getit[i].faceRectangle["width"]+'px; height:'+getit[i].faceRectangle["height"]+'px; top: '+getit[i].faceRectangle["top"]+'px; left:'+getit[i].faceRectangle["left"]+'px; position: absolute;" data-toggle="tooltip" data-placement="top" title="tuổi: '+getit[i].faceAttributes["age"]+'"></a>');
    });
   
    
}
