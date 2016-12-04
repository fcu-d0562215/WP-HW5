$.ajaxSetup({
    method: "GET",
    beforeSend: function(xhr) {
        $("body").append('<div id="loading" style="position:fixed;margin:auto;top:0;bottom:0;left:0;right:0;z-index:1000;width:100%;height:100%;"><a style="transform:translate(-50%);position:fixed;top:50%;left:50%;z-index:1001;font-size:5rem">加載中</a><div/>')


    }
});
$(document).ajaxStop(function() {
    $('#loading').remove();
});

var data;
var Fulldata;

function _view(_index) {
    var str = '<div id="view" style="z-index:999;position:fixed;width:100%;height:100%;background-color:rgba(0,0,0,0.7)"><div style="position:fixed;width:90%;height:80%;background-color:white;margin:auto;top:0;left:0;right:0;bottom:0;overflow:auto"><div class="container-fluid">'
    var img;
    var name;
    var address;
    var grade;
    var parking;
    //<div class="col-md-2"></div>
    $.each(data[_index], function(index, val) {
        if (1) {
            str += '<div class="col-md-12">' + index + ' ' + val + '</div>';
        }
        // str += '<div class="col-md-12">' + index + ' ' + val + '</div>';
    });

    str += '</div></div><div style="position:fixed;color:red;cursor:pointer;right:1.5%;top:1%;font-size:2rem;"><a onclick="_close()">X</a></div></div>'
    $("body").prepend(str);
}

function _close() {
    $("#view").remove()
}

function _row(_data, _index) {
    var index = "_view('" + _index + "')"
    var str = '<tr><td style="padding:0;" onclick="' + index + '"><div class="container-fluid" style="padding:0;">'
    var img = '';
    var name;
    var address;
    var grade;
    var phone;
    //<div class="col-md-2 "></div>
    $.each(_data, function(index, val) {
        // console.log(index, val)
        if (val != "") {
            if (index == "Add") {
                address = '<div class="col-lg-10 push-lg-2 col-md-9 push-md-3">地址：' + val + '</div>';
            } else if (index == "Name") {
                name = '<div class="col-lg-10 push-lg-2 col-md-9 push-md-3"><h1>' + val + ''
                if (_data['Grade'] != "") {
                    for (var i = 0; i < _data['Grade'] * 1; i++) {
                        name += '&#9733;';
                    }

                }
                name += '</h1></div>';
            } else if (index == "Tel") {
                phone = '<div class="col-lg-10 push-lg-2 col-md-9 push-md-3">電話號碼：' + val + '</div>';
            } else if (index == "Picture1") {
                img = '<div class="col-lg-2 pull-lg-10 col-md-3 pull-md-9" style="float:right"><img src="' + val + '" width=100% height=100%></div>';
            }

        }
    });
    if (img == '') {
        img = '<div class="col-lg-2 pull-lg-10 col-md-3 pull-md-9" style="float:right"><img src="img/noimg.png" width=100% height=100%></div>';
    }
    str += img + name + address + phone
    str += '</div></td></tr>'
    return str;
}

function _loadmore(a) {
    var len = $("tbody .container-fluid").length
    for (i = 0; i < a; i++) {
        if (len + i == data.length) {
            return true
        }
        $("tbody").append(_row(data[len + i], len + i))
    }
    return false
}

function _processData() {
    var str = ''
    for (i = 0; i < 100 && i < data.length; i++) {
        str += _row(data[i], i);
    }
    $(".show tbody").html(str)
    $("tbody").on('scroll', function(e) {
        var height = 0;
        var len = $("tbody .container-fluid").length
        $("tbody .container-fluid").each(function() { height += $(this).height() });
        // for (i = 0; i < len; i++) {
        //     height += $($("tbody .container-fluid")[i]).height()
        // }
        // currentRow = len


        // console.log(currentRow, len)
        if ($("tbody").scrollTop() + $("tbody").height() == height + len) {
            if (_loadmore(100)) {
                $("tbody").off('scroll');
            }
        }
    });

}

function _search(key) {
    // data = data.sort(function(a, b) {
    //     return b.Add.localeCompare(a.Add);
    // });
    data = $.grep(Fulldata, function(n, i) {
        //console.log(n, i)
        return ((n.Add).match(key) || (n.Name).match(key));
    });
    if (data) {
        _processData()
    }
}

function _getData() {
    $.ajax({
        url: "data",
        dataType: "json",
        success: function(response) {
            data = response.Infos.Info;
            Fulldata = data;
            if (_processData()) {

            }
            _resize();
        }
    })
}

$(document).ready(function() {
    _getData()

    $(window).resize(function(event) {
        _resize()
    });
});

function _width() {
    return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
}

function _height() {
    return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
}

function _resize() {
    var thead_height = $(".table-fixed thead tr th").css('height').replace('px', '') * 1 * $(".table-fixed thead tr").length;
    $(".table-fixed tbody").css('height', _height() - thead_height);
}
