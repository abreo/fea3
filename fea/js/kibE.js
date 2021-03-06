//加载tab页
$("#tabs").tabs();
var navLi = $("#tabs .list"); 
var isIndexTab = true;
var default_table = "";
var date_field_value ="";
navLi.eq(0).click(function(){
	if(default_table!=""){
 		$("#indexs option").each(function (){  
			var txt = $(this).text(); 
			if($(this).text()==default_table){
				$(this).attr("selected",true);										
			}
		});
	}else{
	 showIndex();
	}
});
navLi.eq(1).click(function(){
	 // showFiledsByType();
	 dumpFileds();
	 isIndexTab = false;
});

$(document).ready(function() {
	//加载所有索引名称
	showIndex();
	//加载ssdb sql
	loadHasEsql();	
});

//将时间毫秒数转化为YYYY-MM-DD
function formattime(str)
  {   
  	  var time = new Date(str);  
      var year = time.getFullYear();       //年</span>  
      var month = time.getMonth() + 1;  //月  
      var day = time.getDate();         //日  
      var hh = time.getHours();       //时  
      var mm = time.getMinutes();    //分  
      var str= year + "-";  
      if(month < 10)  
         str+= "0";  
      str+= month + "-";  
      if(day < 10)  
          str+= "0";  
      str+= day + " ";  
      return(str);   
  }   
$('body').on('click','p.menu_head',function(){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值	
	filedName = $(this).text();
	showFieldGroupBy(tablename,filedName);
	$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
	$(this).siblings().removeClass("current");
});
//添加查询条件
$('body').on('click','span#add',function(){
	value = $(this).parent().attr('id');
	field = $(this).parent().parent().attr('id');
	createButton(field,value);
});
//移除查询条件
$('body').on('click','span#remove',function(){
	value = $(this).parent().attr('id');
	field = $(this).parent().parent().attr('id');
	// field = $("p.current").text();
	removeButton(field,value);
});
//移除查询条件
$('body').on('click','button.remove_con',function(){
	var field_value = $(this).parent().text();	
	removeButton2(field_value);
});

//选择索引
$('body').on('change','#indexs',function(){
	tablename = $(this).children('option:selected').val();//这就是selected的值
	default_table = tablename;
	showTableInfo(tablename,null); //显示数据表格
	descFiledsInfo(tablename);
	// showFiledsByType();
	// dumpFileds();
	$('#apply').html("<button id='add_apply' class='btn btn-info'>添加到DF表</button>");
	$('#save_ke').html("<button id='save_data' class='btn btn-info'>储存数据</button>");	
});
//显示添加到DF表
$("body").on("click","#add_apply",function(e){
	e.preventDefault();
	$("#add_to_apply").modal("toggle");
		      
});
//-------存储数据
$("body").on("click","#save_data",function(e){
	e.preventDefault();
	$("#save_data_d").modal("toggle");
		      
});
$("body").on("click","#testSql",function(e){
	$( "#jdbc0" ).dialog({
			height:"600",
			width:"800",
			resizable: false
		});	
		$('#jdbc0').find('iframe').attr('src','http://10.68.23.74:9600/module/customQuery/module2.html?sql=select * from aa;&dbId=sdp_spark');

	// $.ajax({
     //         url: "http://10.68.23.74:9600/rest/sdp_hive/query",
     //         type: 'GET',
	//		  dataType: 'jsonp',
     //         data: {
     //           q: "select * from students",
     //           isWeb: true
     //         },
      //        success: function(data) {
	//				console.info(data)
		//			$( "#jdbc0" ).dialog({
		//				height:"600",
		//				width:"800",
		//				resizable: false
		//			});	
					//$('#jdbc0').find('iframe').attr('src','http://10.68.23.74:9600');
		//		}               
        //    });
});



$(".store_type li a").on("click",function(){
	var type=$(this).text();		
	$("#store_type").val(type);		
	if(type=="csv"||type=="pkl"){
		$(".store_txt,.store_sql").show();
		$(".store_connect").hide();
	} if(type=="jdbc"){
		$(".store_txt").hide();
		$(".store_sql,.store_connect").show();
	} if(type=="esql"){
		$(".store_txt").hide();
		$(".store_sql,.store_connect").show();
	} if(type=="nosql"){
		$(".store_txt").hide();
		$(".store_sql,.store_connect").show();
	}
});
//--------数据源链接名称-----
$(".store_connect li a").on("click",function(){
	var store_connect=$(this).text();		
	$("#store_connect").val(store_connect);				
});

function subStoreOk(s){

	$.ajax({
		url:"/exec?prmtv="+s,
		type:'get',
		cache : false,
		success:function(data){
			console.info(data);
			var data=JSON.parse(data);
			var error=data.error;
			var ret=data.ret;
			if (ret===0) {
				// $("#errorSpace").val("");
				// $("#errorSpace").val(results);
				// showTables();
			}
			if (ret===1){
				$("#errorSpace").val("");
				$("#errorSpace").val(error);
				alert("存储出错，请重新存储。");
				$("#mt01").modal("toggle");
			}					
		}
	});
};
$("#subStore").click(function(){
	var df_name_store = $("#indexs").children('option:selected').val();//这就是selected的值	
	//存储类型为csv或者pkl时
	if($("#store_type").val()=="csv"||$("#store_type").val()=="pkl"){						
		var b=$("#store_txt").val();
		var c=$("#store_type").val();
		var d=$("#store_param").val();
		var pcsv;
		if (d==""||d==null) {
		 	pcsv="store "+df_name_store+" to "+c+" by "+b;
		 }else {
		 	pcsv="store "+df_name_store+" to "+c+" by "+b+" with ("+d+")";
		 }
		 subStoreOk(pcsv);			
		
	}
	//存储类型jdbc时
	if($("#store_type").val()=="jdbc"){			
		var b=$("#store_connect").val();
		var d=$("#store_sql").val();
		var pjdbc="store "+df_name_store+" to jdbc by "+b+" with "+d;			
		 subStoreOk(pjdbc);
	}

	if($("#store_type").val()=="esql"){			
		//var a=$("#type").val();
		var b=$("#store_connect").val();
		var d=$("#store_sql").val();
		var pesql="store "+df_name_store+" to udb by "+b+" with "+d;		
		subStoreOk(pesql);
	}

	if($("#store_type").val()=="nosql"){			
		//var a=$("#type").val();
		var b=$("#store_connect").val();
		var d=$("#store_sql").val();
		var pnosql="store "+df_name_store+" to ssdb by "+b+" with "+d;			
		subStoreOk(pnosql);
	}
});

//-------存储数据
//根据索引名称得到其对应的所有时间字段，并且设置到date_fields的select中
function set_date_fields(){

}


$('#add_apply_bt').click(function(){
	df_name = $('#df_name').val();
	workspace = $('#workspace').val();
	search_con = getSearchCon();
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}
	if(isIndexTab){
		//当索引选中的话是查询语句，当分组选中的话sql变为select  .... group by ....
		df_sql = df_name+":= load udb by udb0 query (select * from "+tablename+con+" ) with (root/toor)";	
	}else{
		df_sql = df_name+":= "+group_sql;
	}

	console.info("df_sql:"+df_sql);
	//打开新建工作区
	$.ajax({
    	url:"/exec?prmtv="+"use "+workspace,
		type:'get',
		cache : false,
		success:function(data){
			$.ajax({
				url:"/exec?prmtv="+df_sql,
				type:'get',
				cache : false,
				success:function(response){
					var data=JSON.parse(response);
					var st = data["result"][0].ST;
					var ti = data["result"][0].TI;
					check("skip",st,ti);			
				}
			});
		}
    });	
})

var histogram = "date";
//选择一个ESQL
$('body').on('change','#has_esql',function(){
	var esql_name = $(this).children('option:selected').val();//这就是selected的值
	key = "ke:"+esql_name
	console.info(key);
	//将类型归类
	// showFiledsByType();
	dumpFileds();
	$.ajax({
	        type: "get",
	        async: true,
	        timeout : 1000*600,
	        dataType:"jsonp",
	        url: "/db/jsonp/ssdb0/"+key,             
	        success: function(response) {       	
	        	var table_name = response[0].table_name;
	        	var show_con = response[0].con;
	        	var x_type = response[0].x_type;
	        	var yContentshow = response[0].y_content;
	        	var ke_x_field = response[0].x_fields;
	        	var x_values = response[0].x_values;
	        	console.info(response[0].name+" sql:"+response[0].gp_sql+"tablename:"+response[0].table_name);
	      //   	//显示选择表名
	        	  $("#indexs option").each(function (){  
 						var txt = $(this).text(); 
 						if($(this).text()==table_name){
 							$(this).attr("selected",true);
 							showTableInfo(table_name,null); //显示数据表格
 							tablename = table_name;
 							//显示表名对应的字段
							descFiledsInfo(table_name);							
 						}
	        	  });
	        	//查询条件显示
	        	 $("#search_con").val(show_con);
	        	//x轴显示
	        	 $("#x_type option").each(function (){
	        	  	var txt = $(this).text(); 
	        	  	if(txt == x_type){
						$(this).attr("selected",true);
					}
	        	 	if(x_type === "date_histogram"){
	        	 		x_fields =  dateFields;
	        	 		console.info("xtype:"+x_type+" x_fields:"+x_fields);
	        	 		var names = [];		
						for(var i=0;i<x_fields.length;i++){       					
							var name ='<option value='+x_fields[i]+'>'+x_fields[i]+'</option> ';
					   		names.push(name);	
					   	}	
					   	$("#x_fields").html(names);	
					   	 $("#x_fields option").each(function (){
					   	 	var txt = $(this).text(); 
					   	 	console.info("txt:"+txt+" ke_x_field:"+ke_x_field)
			        	  	if($(this).text()==ke_x_field){
								$(this).attr("selected",true);
							}
					   	 })
					   	 var date_histogram_select = "<label class='form-label'>间隔</label> <select id='date_interval' class='form-control' style='width:120px'>"+
							"<option value='year'>year</option>"+
							"<option value='quarter'>quarter</option>"+
							"<option value='month'>month</option>"+
							"<option value='week'>week</option>"+
							"<option value='day'>day</option>"+
							"<option value='hour'>hour</option>"+
							"<option value='minute'>minute</option>"+
							"<option value='second'>second</option>"+
							"</select>";
							$("#x-group").html(date_histogram_select);
							 $("#date_interval option").each(function (){
					   	 		var txt = $(this).text(); 		   	 	
				        	  	if($(this).text()==x_values){
									$(this).attr("selected",true);
								}
					   	 })
						        	 		
	        	 	}
	        	 })
				//显示y轴信息
				paseyContent(yContentshow);
	        }
	    });
});


function paseyContent(yContentshow){
	var show_ys = new Array(); //定义一数组 
	show_ys =  yContentshow.split(",")
	for (y = 0;y < show_ys.length ;y++ ) 
	{ 
		var asPox = show_ys[y].indexOf("as");
		var y_alias = "";
		if(asPox != -1){
			y_alias = show_ys[y].substr(asPox+2,show_ys[y].length);			
		}else{
			asPox = show_ys[y].length;
		}
		var beforePox = show_ys[y].indexOf("(");
		var afterPox = show_ys[y].indexOf(")");
		var y_fun = "";	
		var y_field = "";
		if(beforePox != -1){
			y_fun = show_ys[y].substr(0,beforePox);
			y_field = show_ys[y].substr(beforePox+1,afterPox-4).trim();
		}
		console.info("-------------y_fun:"+y_fun+"  y_field:"+y_field+"   y_alias:"+y_alias);
		console.info("-------------y_field len:"+y_field.length+"numberFields:"+numberFields);
		var  aa = '<div  class="y-container"><button type="button" class="btn btn-info" data-toggle="collapse" data-target="#y-axis'+y+'">'+
	 				    'y轴<b class="caret"></b></button> <a href="#" class="dely"><span class="glyphicon glyphicon-remove"></span></a>'+
	 				    '<div  id="y-axis'+y+'" class="collapse"> '+
	 				    '<label class="form-label">函数</label>'+
	 				    '<select id="y_fun'+y+'" class="y_fun form-control" style="width:120px">'+
	 				    '<option value="min">min</option>'+
							'<option value="max">max</option>'+
							'<option value="sum">sum</option>'+
							'<option value="avg">avg</option>'+
						'</select>'+
						'<label class="form-label">字段</label>'+
						'<select id="y_fields'+y+'" class="y_fields form-control" style="width:120px"></select>'+
						'<label  class="form-label">别名</label>'+
						'<input id="y-alias'+y+'" class="y-alias form-control" style="width:120px">'+
						'</div> </div>';
		$("#y-axiss").append(aa);
		var numberFieldsSelect = [];
		for(var i=0;i<numberFields.length;i++){ 
			var name ='<option value='+numberFields[i]+'>'+numberFields[i]+'</option> ';
			numberFieldsSelect.push(name);
		}
		$("#y_fields"+y).html(numberFieldsSelect);	
		
		$("#y_fun"+y+" option").each(function (){
   	 		var txt = $(this).text(); 		   	 	
    	  	if($(this).text()==y_fun){
				$(this).attr("selected",true);
			}
   	 	})
   	 	$("#y_fields"+y+" option").each(function (){
   	 		var txt = $(this).text(); 		   	 	
    	  	if($(this).text()==y_field){
				$(this).attr("selected",true);
			}
   	 	})
 		$("#y-alias"+y).val(y_alias);		
	} 
}
var range = 0;
$('body').on('click','#add_range',function(){	
	range++;
	$("#range_tables").append("<div class='range_table'> <p><button class='delrange'></button></p><p><label>FROM</label>"+
		"<input class='from_key_c' id='from_key'"+range+" type = 'text' ></p><p><label>TO</label><input class='to_key_c' id='to_key'"+range+"type = 'text'></p></div>");

});
$('body').on('click','#add_ip_range',function(){	
	range++;
	$("#ip_range_tables").append("<div class='ip_range_table'> <p><button class='delrange'></button></p><p><label>FROM</label>"+
		"<input class='ip_from_key_c' id='ip_from_key'"+range+" type = 'text' ></p><p><label>TO</label><input class='ip_to_key_c' id='ip_to_key'"+range+"type = 'text'></p></div>");
});
//选择group by 类型

$('#x_type').on('change', function() {
	var x_typeValue = $(this).children('option:selected').val();//这就是selected的值
	$("#x_fields").html("");
	x_fields = [];
	if(x_typeValue == "terms"){
		x_fields = allTypeFields;
		$("#x-group").html("");
	}
	else if(x_typeValue == "range" ){
		x_fields = numberFields;
		//添加from to
		$("#x-group").html("");
		var x_range_html = "<div id='range_tables'><div class='range_table'> <p><button class='delrange'></button></p><p><label>FROM</label>"+
		"<input class='from_key_c'  id='from_key' type = 'text' ></p><p><label>TO</label><input class='to_key_c'  id='to_key' type = 'text'></p></div></div>"+
		"<button id='add_range' type='button' class='btn btn-default' >添加range</button>";
		$("#x-group").html(x_range_html);
	
	
	}else if(x_typeValue == "ip_range"){
		$("#x-group").html("");
		//添加from to
		x_fields = ipFields;
		var x_range_html = "<div id='ip_range_tables'><div class='ip_range_table'> <p><button class='delrange'></button></p><p><label>FROM</label>"+
		"<input class='ip_from_key_c'  id='ip_from_key' type = 'text' ></p><p><label>TO</label><input class='ip_to_key_c'  id='ip_to_key' type = 'text'></p></div></div>"+
		"<button id='add_ip_range' type='button' class='btn btn-default' >添加range</button>";
		$("#x-group").html(x_range_html);
			
	}else if(x_typeValue == "date_histogram"){
		$("#x-group").html("");
		x_fields =  dateFields;
		//选择时间，添加间隔select
		
		var date_histogram_select = "<label class='form-label'>间隔</label> <select id='date_interval' class='form-control' style='width:120px'>"+
		"<option value='year'>year</option>"+
		"<option value='quarter'>quarter</option>"+
		"<option value='month'>month</option>"+
		"<option value='week'>week</option>"+
		"<option value='day'>day</option>"+
		"<option value='hour'>hour</option>"+
		"<option value='minute'>minute</option>"+
		"<option value='second'>second</option>"+
		"</select>";
		$("#x-group").html(date_histogram_select);

	}else if( x_typeValue == "histogram"){
		//添加间隔input
		x_fields = numberFields;
		$("#x-group").html("");
		var histogramInterval = "<label class='form-label'>间隔</label> <input id='interval' type = 'text' class='form-control' style='width:120px'>";
		$("#x-group").html(histogramInterval);
		
	}
	var names = [];		
	for(var i=0;i<x_fields.length;i++){       					
		var name ='<option value='+x_fields[i]+'>'+x_fields[i]+'</option> ';
   		names.push(name);	
   	}	
   	$("#x_fields").html(names);	
	});

$("body").on("click",".delrange",function(){	  			
	div = $(this).parent().parent();
	div.remove();			
});

var y = 0;
$("#add_y").click(function(){	
	y++;	
	$("#y-axiss").append('<div  class="y-container"><button type="button" class="btn btn-info" data-toggle="collapse" data-target="#y-axis'+y+'">'+
					    'y轴<b class="caret"></b></button> <a href="#" class="dely"><span class="glyphicon glyphicon-remove"></span></a>'+
					    '<div  id="y-axis'+y+'" class="collapse"> '+
						'<label class="form-label">函数</label>'+
						'<select id="y_fun'+y+'" class="y_fun form-control" style="width:120px">'+
							// '<option value="count">count</option>'+
							'<option value="min">min</option>'+
							'<option value="max">max</option>'+
							'<option value="sum">sum</option>'+
							'<option value="avg">avg</option>'+
						'</select>'+
						'<label class="form-label">字段</label>'+
						'<select id="y_fields'+y+'" class="y_fields form-control" style="width:120px"></select>'+
						'<label  class="form-label">别名</label>'+
						'<input id="y-alias'+y+'" class="y-alias form-control" style="width:120px" value="min_a">'+
						'</div> </div>');

	var numberFieldsSelect = [];
	for(var i=0;i<numberFields.length;i++){ 
		var name ='<option value='+numberFields[i]+'>'+numberFields[i]+'</option> ';
		numberFieldsSelect.push(name);
	}
	$("#y_fields"+y).html(numberFieldsSelect);	

});
//选择y函数的同时，默认将别名设置上
$("body").on("change",".y_fun",function(){
	var y_fun = $(this).children('option:selected').val();//这就是selected的值
	var y_fun_id = $(this).attr('id')	
	var y_alias_id = y_fun_id.replace('y_fun','y-alias');
	$("#"+y_alias_id).val(y_fun+"_a");
})


$("body").on("click",".dely",function(){
	div = $(this).parent();
	div.remove();
});

// function load_date_field_value(field){
// 	date_field_value = field;
// 	console.info("-----date_field_value"+date_field_value);
// }
//将字段按类型归类
/*var showFiledsByType = function(){
	dateFields = [];
	numberFields = [];
	stringFields = [];
	allTypeFields = [];
	ipFields = [];
	
	dumpVar = "dump desc_table";
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			var data=result.data;
			// var d = 0;
			// var l = 0;
			// var s = 0;
			// var ip = 0;
			for (var i = 0; i < data.length; i++) {						
				var row = data[i];
				var field = row[2];
				var type = row[6];
				if(type == "date" ){
					// load_date_field_value(field);
					date_field_value = field;
					dateFields.push(field);
					allTypeFields.push(field);
				}
				if(type == "long"){
					// if(l == 0 ){
					// 	// numberFields.push("----number----");	
					// 	// allTypeFields.push("----number----");			
					// }
					// l++;
					numberFields.push(field);
					// allTypeFields.push(field);
				}
    			if(type == "string"){
    				// if(s == 0){
    				// 	// stringFields.push("----string----");
    				// 	// allTypeFields.push("----string----");			
    				// }
    				// s++;
    				stringFields.push(field);
    				// allTypeFields.push(field);
    			}
    			if(type == "ip"){
    				// if(ip == 0){
    				// 	// ipFields.push("----ip----");
    				// 	// allTypeFields.push("----ip----");			
    				// }
    				// ip++;
    				ipFields.push(field);
    				// allTypeFields.push(field);
    			} 

			}
			// load_date_field_value(date_field_value);
			Array.prototype.push.apply(allTypeFields, numberFields);
			Array.prototype.push.apply(allTypeFields, stringFields);
			Array.prototype.push.apply(allTypeFields, ipFields);
			console.info("dateFields="+dateFields);
			console.info("stringFields="+stringFields);
			console.info("numberFields="+numberFields);
			console.info("allTypeFields="+allTypeFields);
			//class为y_fields的select赋值numberFields
			var numberFieldsSelect = [];
			for(var i=0;i<numberFields.length;i++){ 
				var name ='<option value='+numberFields[i]+'>'+numberFields[i]+'</option> ';
				numberFieldsSelect.push(name);
			}
			// console.info(numberFieldsSelect);
			$("#y_fields0").html(numberFieldsSelect);
			$("#x_fields").html(numberFieldsSelect);		  	
		}
	});
};
*/

String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}
//组装查询条件
var getSearchCon = function(){
	var search_con_text = null;
	search_con_text = $.trim($("#search_con").val());
	search_con = search_con_text;
	//查询条件是所有button值 AND 查询条件值
	var consize = $("#nav_box span.search_btn").size()
	$("#nav_box span.search_btn").each(function(){
		var a = $(this).text();
		if(search_con_text===null || search_con_text===""){
			if(consize > 1){
				search_con = search_con+a +" AND ";
			}else{
				search_con = search_con+a ;
			}
		}else{
			search_con = search_con+" AND "+a;	
		}
		
	});
	if(search_con.endWith("AND ")){
		search_con = search_con.substr(0,search_con.length-5);
	}
	return search_con;
}

var createButton = function(field,value){
	// var buttonValue = field+"=\""+value+"\"";
	var buttonValue = field+"="+value;
	// var button='<button class="con btn btn-default">'+buttonValue+'</button>';
	var button='<span class="search_btn">'+buttonValue+'<button class="remove_con"></button></span>';		
	$("#nav_box").append(button);
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值	
	search_con = getSearchCon();
	showTableInfo(tablename,search_con);
	
}
var removeButton = function(field,value){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值
	// var b = field+"=\""+value+"\"";
	var b = field+"="+value;
	$("#nav_box span.search_btn").each(function(){
		var a = $(this).text();
		if (a===b) {
			$(this).remove();
		}
	});
	search_con = getSearchCon();
	showTableInfo(tablename,search_con);	
}
var removeButton2 = function(field_value){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值
	b=field_value;
	$("#nav_box span.search_btn").each(function(){
		var a = $(this).text();		
		if (a===b) {		
			$(this).remove();
		}
	});
	search_con = getSearchCon();
	showTableInfo(tablename,search_con);	
}


$("#search").click(function(){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值	
	var search_con=$.trim($("#search_con").val());
	search_con = getSearchCon();
	showTableInfo(tablename,search_con);	
	
});

var Language = {
		"sProcessing" : "处理中...",
		"sLengthMenu" : "显示 _MENU_ 项结果",
		"sZeroRecords" : "没有匹配结果",
		"sInfo" : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
		"sInfoEmpty" : "显示第 0 至 0 项结果，共 0 项",
		"sInfoFiltered" : "(由 _MAX_ 项结果过滤)",
		"sInfoPostFix" : "",
		"sSearch" : "搜索:",
		"sUrl" : "",
		"sEmptyTable" : "表中数据为空",
		"sLoadingRecords" : "载入中...",
		"sInfoThousands" : ",",
		"oPaginate" : {
			"sFirst" : "首页",
			"sPrevious" : "上页",
			"sNext" : "下页",
			"sLast" : "末页"
		}
	};

var dump_t_count1 = function(tablename){
	search_con = getSearchCon();
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}
	// // 获取总条数
	var t_count = tablename+"_count";
	dump_t_count = t_count+":= load udb by udb0 query (select count(*) from "+tablename+con+" limit 100) with (root/toor)";
	exec_dump_count(dump_t_count);
}

//执行查询条数的sql语句
var exec_dump_count = function(sql){
	$.ajax({
		url:"/exec?prmtv="+dump_t_count,
		type:'get',
		cache : false,
		success:function(response){		
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("t_count",st,ti);						
		}
	});
}

var dumpTCount = function(){
	var table = $("#indexs").children('option:selected').val();//这就是selected的值	
	tablename_count = table+"_count";
	dumpVar = "dump "+tablename_count;
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			var data=result.data;
			// $("#totalCount").html("");
			var tcount = "<div><span  class='total'>总条数："+data[0]+"</span></div>";
			$("#totalCount").append(tcount);
																			
		}
	});
};




tableColumns = [];
var dumpTable = function(){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值	
	dumpVar = "dump "+tablename;
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			
			var data=result.data;
			var index=result.index;	
			var myCol2=[];
			for (var i = 0; i < myCol.length; i++) {
				var a=myCol[i].toString();
				myCol2.push(a);
			}
			tableColumns = myCol2;
			//讲index添加到列名中
			//unshift：将参数添加到原数组开头，并返回数组的长度
			var b = myCol2.unshift("index"); // b为新数组的长度，myCol除了原来的对象，增加里index
			myColArrs=[];
			dataArr=[];			
			if(myColArrs.length==0){
				for(var i=0;i<myCol2.length;i++){
					myColArrs.push({"title":myCol2[i]})
				}
				for (var i = 0; i < data.length; i++) {
					var b=data[i].unshift(index[i]);
					var data_content = data[i];

					dataArr.push(data_content);
				}			
			}		
			loadData(tablename);
		}
	});
};

/*var dumpHistogram = function(type){
	dumpVar = "dump date_histogram";
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var result=dataAll.result;
	        var datas=JSON.parse(result);
	        var name=datas.columns;
	        var data=datas.data;
	        console.info("dumpHistogram  name:"+name)
	        console.info("dumpHistogram   data:"+data)
			xvalues = [];
			yvalues = [];
			legend_data = [];
			
			//获取x轴
			x_type = $("#x_type").children('option:selected').val();//这就是selected的值
			x_fields = $("#x_fields").children('option:selected').val();//这就是selected的值
			for(var j=0;j<data.length;j++){ 
				xvalue = data[j][x_fields];
				xvalues.push(xvalue);

			}

			var series_p = [];
			for(var j=0;j<data.length;j++){ 
				$(".y-alias").each(function(){
					var y_aliasvalue = $(this).val();//这就是selected的值	
					yvalue = data[j][y_aliasvalue];	
				});
				
				xvalues.push(xvalue);
				yvalues.push(yvalue);
				    			
			}	 
			// var series_p = [];
			// $(".y-alias").each(function(){
			// 	var y_aliasvalue = $(this).val();//这就是selected的值	
			// 	legend_data.push(y_aliasvalue);	

			// 	var o={
			// 		name:y_aliasvalue,
			// 		type:'line',
			// 	    data:ss
				   
			//  	};						
			// });
				



	         option.xAxis[0].data=xvalues; //x 轴值
	         option.legend.data=legend_data;  //分类项 count
	         option.series = series_p;
	         // option.series[0].name=series_name; 
	         // option.series[0].data=yvalues; //y 轴值  name=count data=value
	         date_Chart.setOption(option,true);
		}
	});
		
}*/

var dumpHistogram = function(type){
	dumpVar = "dump date_histogram";
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var result=dataAll.result;
	        var datas=JSON.parse(result);
	        var name=datas.columns;
	        var data=datas.data;
			xvalues = [];
			yvalues = [];
			legend_data = [];
			var overturn = false;
			series_name = name[0];
			if(series_name!="count"){
				series_name = name[1];
				overturn = true;
			}
			legend_data.push(series_name);
			
			for(var j=0;j<data.length;j++){ 
				if(overturn){
					xvalue = data[j][0];
					yvalue = data[j][1];
					
				}else{
					xvalue = data[j][1];
					yvalue = data[j][0];					
				}
				if(histogram=="date"){
					xvalue = formattime(xvalue);
				}
				xvalues.push(xvalue);
				yvalues.push(yvalue);
				    			
			}	        							
	         option.xAxis[0].data=xvalues; //x 轴值
	         option.legend.data=legend_data;  //分类项 count
	         option.series[0].name=series_name; 
	         option.series[0].data=yvalues; //y 轴值  name=count data=value
	         date_Chart.setOption(option,true);
		}
	});		
}

var dumpTGroup = function(){
	var tablename = $("#indexs").children('option:selected').val();//这就是selected的值	
	// dumpVar = "dump "+tablename+"_group";
	dumpVar = "dump "+tablename;
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			
			var data=result.data;
			var index=result.index;	
			var myCol2=[];
			for (var i = 0; i < myCol.length; i++) {
				var a=myCol[i].toString();
				myCol2.push(a);
			}
			tableColumns = myCol2;
			//讲index添加到列名中
			//unshift：将参数添加到原数组开头，并返回数组的长度
			var b = myCol2.unshift("index"); // b为新数组的长度，myCol除了原来的对象，增加里index
			myColArrs=[];
			dataArr=[];			
			if(myColArrs.length==0){
				for(var i=0;i<myCol2.length;i++){
					myColArrs.push({"title":myCol2[i]})
				}
				for (var i = 0; i < data.length; i++) {
					var b=data[i].unshift(index[i]);
					dataArr.push(data[i]);
				}			
			}		
			loadGroupData();
			// loadData(tablename);
		}
	});

}

var dumpFileds = function(){
	dateFields = [];
	numberFields = [];
	stringFields = [];
	allTypeFields = [];
	ipFields = [];
	dumpVar = "dump desc_table";
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			var data=result.data;

			$("#firstpane").html("");
			for (var i = 0; i < data.length; i++) {						
				var row = data[i]
				var field = row[2]
    			// var p = "<p class='menu_head'>"+field+"</p><div id="+field+" style='display:none' class=menu_body></div><span  class='field_s'>"+field+"</span><span class='add_icon'>"+field+"</span>"
    			var p = "<div class='field_d'><p class='menu_head'>"+field+"</p><div id="+field+" style='display:none' class=menu_body></div><span class='field_s'>"+field+"</span></div>"
    			$("#firstpane").append(p);
    			var type = row[6];
    			if(type == "date" ){				
					date_field_value = field;
					dateFields.push(field);
					allTypeFields.push(field);
				}else if(type == "long"){
					numberFields.push(field);
				}else if(type == "string"){
					stringFields.push(field);
				}else if(type == "ip"){
					ipFields.push(field);
				}
			}
			Array.prototype.push.apply(allTypeFields, numberFields);
			Array.prototype.push.apply(allTypeFields, stringFields);
			Array.prototype.push.apply(allTypeFields, ipFields);
			console.info("dateFields="+dateFields);
			console.info("stringFields="+stringFields);
			console.info("numberFields="+numberFields);
			console.info("allTypeFields="+allTypeFields);
			//class为y_fields的select赋值numberFields
			var numberFieldsSelect = [];
			for(var i=0;i<numberFields.length;i++){ 
				var name ='<option value='+numberFields[i]+'>'+numberFields[i]+'</option> ';
				numberFieldsSelect.push(name);
			}
			$("#y_fields0").html(numberFieldsSelect);
			$("#x_fields").html(numberFieldsSelect);	
			// showFiledsByType();			
		}
	});
}
 




var showTableInfo = function(tablename,search_con){
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}
	dump_table = tablename+":= load udb by udb0 query (select * from "+tablename+con+" limit 100) with (root/toor)";
	$.ajax({
		url:"/exec?prmtv="+dump_table,
		type:'get',
		cache : false,
		success:function(response){
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("select_table",st,ti);			
		}
	});
	
};

//显示表字段信息
var descFiledsInfo = function(tablename){
	desc_table = "desc_table:= load udb by udb0 query (desc "+tablename+") with (root/toor)";
	$.ajax({
		url:"/exec?prmtv="+desc_table,
		type:'get',
		cache : false,
		success:function(response){
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("desc",st,ti);	
			}
		});
	};	

function loadGroupData(){

	$("#show_table").html("");
	$("#show_table").append("<table class="+tablename+"></table>");
	insertDataToTable(tablename);
	search_con = getSearchCon();
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}


	showHistogram(date_histogram_group_sql+con);
	// $("#show_table").html("");
	// $("#show_table").append("<table class="+tablename+"></table>");
	// insertDataToTable(tablename);
}


function loadData(tablename){
	// $("#right_list").html("");
	// $("#right_list").append("<div id='df_zone' class='col-md-10 top_px'> </div>");
	// $("#df_zone").append("<div id='totalCount' class='totalCount' style='margin:auto;height:20px'></div>");
	// $("#df_zone").append("<div id='date_histogram' style='margin:auto;height:200px'></div><table class="+tablename+"></table>");

	// $("#right_list").append('<div id="tools" class="col-md-2 top_px"></div>')
	// $("#tools").append("<div class='tool'></div>");	
	// $(".tool").append("<ul class='list-unstyled'></ul>");
	$("#show_table").html("");

	$("#totalCount").html("");
	$("#date_histogram").html("");
	$("#show_table").append("<table class="+tablename+"></table>");
	$(".tool ul").html("");
	var icon=["-plus","-minus","-th-large","-pencil","-eye-open","-edit","-text-color","-random","-log-in","-plus-sign","-list","-move","-tag","-magnet","-grain","-stats"];
	var name=["增加","过滤","选择","排序","去重","列类型","字符串","单字段分组求和","行列互换","填充空值","设置索引","重置索引","分组统计","udf函数","lambda函数","绘图"];
	for(var i=0;i<16;i++){
		var html='<li class="tool'+i+'"><a href="javascript:void(0)"><span class="glyphicon glyphicon'+icon[i]+'"></span>'+name[i]+'</a></li>';
		$("#tools").find(".tool ul").append(html);
	}
	// search_con = getSearchCon();
	sql = date_histogram_sql_f();//组装时间轴sql
	showHistogram(sql);//显示时间轴
	dump_t_count1(tablename);
	insertDataToTable(tablename);	
}

function insertDataToTable(tablename){
	if ( $.fn.dataTable.isDataTable("."+tablename)) {
		// delete $("#tableInfo").DataTable()
		$("."+tablename).DataTable().clear();
        $("."+tablename).DataTable().destroy();
	    tableInfo=$("."+tablename).DataTable({	
		columns : myColArrs,
		data:dataArr,
		scrollY: "400px",
		ordering:false,
		scrollX: true, 

		retrieve: true,
		asStripClasses:	["odd"],
		paging: false,		
		"oLanguage" :Language
		});	
	}
	else {
	    tableInfo=$("."+tablename).DataTable({		   		
		columns : myColArrs,
		data:dataArr,
		scrollY: "400px",
		asStripClasses:	["odd"],
		ordering:false,
		scrollX: true, 		
		"oLanguage" :Language
		});	
	}
};

function dumpFieldGroup (){
	dumpVar = "dump fieldGroup";
	$.ajax({
		url:"/exec?prmtv="+dumpVar,
		type:'get',
		cache : false,
		dataType:'json',
		success:function(dataAll){
			var results=dataAll.result;		
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			var data=result.data;
			var countPox = 0;
			for (var i = 0; i < myCol.length; i++) {
				var a = myCol[i].toString();
				if(a == "count"){
					countPox = i;
				}
			}
			var fieldPox = 1-countPox;
			$("#"+filedName).html("");	
			for (var i = 0; i < data.length; i++) {						
				var row = data[i]
				var field = row[fieldPox]
				var count = row[countPox]	
				//<span id = 'remove' class='glyphicon glyphicon-minus'></span>				
    			var a = "<a href='#' id='"+field+"'>"+field+" <span clss='fieldCount'>"+"("+count+")</span><span id='add' class='fieldAdd glyphicon glyphicon-plus'></span> <span id = 'remove' class='glyphicon glyphicon-minus'></span></a>";
        		$("#"+filedName).append(a);
			}	
		}
	});
}

function showFieldGroupBy(tablename,filedName){
	fieldGroup = "fieldGroup:= load udb by udb0 query (select * from "+tablename+" group by "+filedName+" limit 5) with (root/toor)";
	$.ajax({
		url:"/exec?prmtv="+fieldGroup,
		type:'get',
		cache : false,
		success:function(response){
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("fieldGroup",st,ti);	
		}
	});
}

var showConfigIndex=function(){
	$("#index_config_content").modal("toggle");
	//可拖拽
    $("#index_config_content").draggable({   
	    handle: ".modal-header",   
	    cursor: 'move',   
	    refreshPositions: false  
	});	
};


var check=function(type,st,ti){
	$.ajax({
        type: "get",
        async: true,
        dataType : 'json',
        timeout : 1000*600, //超时时间设置，单位毫秒
        url: "/exec?prmtv=check task by "+ti+" with ("+st+")",             
        success: function(response) { 
            var progress=response.result.progress;
            var isAlive=response.result.isAlive;
            var endTime=response.result.end_time;
            var error_count=response.result.error_count;
            var error=response.result.error_info;                     
            if(isAlive===true){           	
            	setTimeout(check(type,st,ti),8000);				
            }
            else{  
            	if(type=="show_tables"){
					dump_Udb_tables();	
            	}else if(type=="desc"){
            		dumpFileds();
            	}else if(type=="select_table"){
            		dumpTable();
            	}else if(type == "t_count"){
            		dumpTCount();
            	}else if(type == "t_groupby"){
            		dumpTGroup();
            	}else if(type == "date_histogram"){
            		dumpHistogram();
            	}else if(type == "fieldGroup"){
            		dumpFieldGroup();
            	}else if(type=="skip"){
            		//跳转到可视化分析页面
            		window.location.href='feaA.fh5?nowWorkSpace='+workspace+'&df_name='+df_name;
            		
            	}
            	
            }                
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status+XMLHttpRequest.readyState+textStatus);
        }
    });
};


var dump_Udb_tables = function(){
	$.ajax({
		url:"/exec?prmtv=dump udb_tables",
		type:'get',
		cache : false,
		dataType:'json',
		success:function(response){
			var results = response.result;	
			var result=JSON.parse(results);
			var myCol=result.columns;//获取列名	
			var data=result.data;
			// var select = "<select id='indexs'  class='form-control' style='width:140px'></select> <div id='firstpane' class='menu_list'></div>"; 
			// $("#index_content").html(select);
			$("#indexs").html("");	
			var names = [];	
			var nullname ='<option value="">选择索引</option> ';
			names.push(nullname);	
        	for (var i = 0; i < data.length; i++) {
        		var d = data[i];	        					        		
        		indexname = d[3];	
       			var name ='<option value='+indexname+'>'+indexname+'</option> ';
       			names.push(name);	
				$("#indexs").html(names);		        		        		
        	}	
		}
	});
}

var showIndex = function(){
	showTable = "udb_tables:= load udb by udb0 query (show tables) with (root/toor)"
	$.ajax({
		url:"/exec?prmtv="+showTable,
		type:'get',
		cache : false,
		success:function(response){
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("show_tables",st,ti);				
		}
	});
};
//组装时间轴的sql语句
var date_histogram_sql_f = function(){
	search_con = getSearchCon();
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}
	date_histogram_sql = "select count(*) from "+tablename+" group by "+date_field_value+".date_histogram[{interval:day}] "+con;
	return date_histogram_sql;
}


var showHistogram= function(sql){
	date_Chart = echarts.init(document.getElementById('histogram'),'infographic');
	option = {
	  	title:{
	  		text:'',
	  		subtext: '',
	  		x:'center'
	  	},
		legend: {
			x: 'center',//垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
			y: 30,
			data:[]
		},
		toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar','pie']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
    	},
		 tooltip : {
	        trigger: 'axis'
	    },
		axisLabel : {
			show:true,
			interval: 'auto'    // {number}
		},
		xAxis : [{
			type : 'category',
			// name:'',
			splitLine:{show:false},
			axisLine:{show:true},
			data:[]
		}],
		yAxis : [{
			type : 'value'		
		}],      
	    grid:{borderWidth:1},
	  	// calculable:true,
	  	series:[{
            name:'',
            // type:'bar',
            type:'line',
            data:[]         
        }]
	  }
	
	var pre_str = "date_histogram:= load udb by udb0 query ("+sql+") with (root/toor)";
	$.ajax({
	    type : 'get',
	    url : "/exec?prmtv="+pre_str,
	    cache : false,
	    success:function(response){
	    	var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("date_histogram",st,ti);	
	    }
	});
};
//保存sql语句
$("#group_save").click(function(){
	$("#save_group").modal('toggle');
	$("#gp_esql").text(date_histogram_group_sql);
	$("#y_content").val(yContent);
})
//运行
$("#group_run").click(function(){
	//获取Y轴信息
	var yContent = "";
	var xContent = "";
	var y_funs = [];
	var y_fields = [];
	var y_alias = [];

	$(".y_fun").each(function(){
		var y_funvalue = $(this).children('option:selected').val();//这就是selected的值
		y_funs.push(y_funvalue);
		console.info("y_funvalue:"+y_funvalue);
		
	});
	$(".y_fields").each(function(){
		var y_fieldsvalue = $(this).children('option:selected').val();//这就是selected的值	
		y_fields.push(y_fieldsvalue);	
		console.info("y_fieldsvalue:"+y_fieldsvalue);
	});
	$(".y-alias").each(function(){
		var y_aliasvalue = $(this).val();//这就是selected的值	
		y_alias.push(y_aliasvalue);
		console.info("y_aliasvalue:"+y_aliasvalue);
	});
	
	var yContent = "";
	for(var i=0;i<y_funs.length;i++){
		y_fun = y_funs[i];
		y_field = y_fields[i];
		y_alia = y_alias[i];
		if(y_fun=="count"){
			yContent = yContent+" count(*)  "
			break;
		}else{
			if(y_alia===null ||y_alia ===""){
				yContent = yContent +y_fun+"("+y_field+") ,";
			}else{
				yContent = yContent +y_fun+"("+y_field+") as "+y_alia+" ,";
			}
		}
	}
	yContent = yContent.substr(0,yContent.length-1);
	console.info("yContent:"+yContent);
	var groupByx = "";
	//获取X轴信息
	$(".x-container").each(function(){
		x_type = $("#x_type").children('option:selected').val();//这就是selected的值
		x_fields = $("#x_fields").children('option:selected').val();//这就是selected的值
		if(x_type=="range"){
			histogram = "range";
			//age_level.range[(0-1980)(1981-1990)(1990-)] 
			var from_to_key = "";		
			var from_keys = [];
			var to_keys = [];
			$(".from_key_c").each(function(){
				var from_key = $(this).val();//这就是selected的值
				from_keys.push(from_key);		
			});
			$(".to_key_c").each(function(){
				var to_key = $(this).val();//这就是selected的值
				to_keys.push(to_key);			
			});
			for(var i=0;i<from_keys.length;i++){
				from_key = from_keys[i];
				to_key = to_keys[i];
				if(from_key!=null && from_key!="" && from_key!=undefined){
					from_key = "'"+from_key+"'";
				}
				if(to_key!=null && to_key!=""&&to_key!=undefined){
					to_key = "'"+to_key+"'";
				}

				from_to_key = from_to_key+"("+from_key+"-"+to_key+")";		
			}			
			xContent = x_fields+"."+"range"+"["+from_to_key+"]";
			x_values = from_to_key;
		}else if(x_type=="date_histogram"){
			histogram = "date";
			var date_interval = $("#date_interval").children('option:selected').val();//这就是selected的值
			xContent = x_fields+"."+"date_histogram"+"[{interval:"+date_interval+"}]";
			x_values = date_interval;
		}else if(x_type == "histogram"){
			histogram = "histogram";
			var interval = $("#interval").val();//这就是selected的值
			xContent = x_fields+"."+"histogram"+"[{interval:"+interval+"}]";
			x_values = interval;
		}else if(x_type == "terms"){
			histogram = "terms";
			xContent = x_fields;
		}else if(x_type == "ip_range"){
			histogram = "ip_range";
			//age_level.range[(0-1980)(1981-1990)(1990-)] 
			var from_to_key = "";		
			var from_keys = [];
			var to_keys = [];
			$(".ip_from_key_c").each(function(){
				var from_key = $(this).val();//这就是selected的值
				from_keys.push(from_key);		
			});
			$(".ip_to_key_c").each(function(){
				var to_key = $(this).val();//这就是selected的值
				to_keys.push(to_key);			
			});
			for(var i=0;i<from_keys.length;i++){
				from_key = from_keys[i];
				to_key = to_keys[i];
				if(from_key!=null && from_key!="" && from_key!=undefined){
					from_key = "'"+from_key+"'";
				}
				if(to_key!=null && to_key!=""&&to_key!=undefined){
					to_key = "'"+to_key+"'";
				}

				from_to_key = from_to_key+"("+from_key+"-"+to_key+")";		
			}
			xContent = x_fields+"."+"ip_range"+"["+from_to_key+"]";
			x_values = from_to_key;
		}

	})
	groupByx = " group by "+xContent ;

	//组装esql  group by 语句
	date_histogram_group_sql = "select "+yContent+"from "+tablename+groupByx;
	var search_con = getSearchCon();
	if(search_con===null || search_con===""){
		con = "";
	}else {		
		con = " where "+search_con;
	}
	group_sql = "load udb by udb0 query ("+date_histogram_group_sql+con+") with (root/toor)";
	t_groupby = tablename+":= "+group_sql;
	console.info(t_groupby);
	$.ajax({
		url:"/exec?prmtv="+t_groupby,
		type:'get',
		cache : false,
		success:function(response){	
			var data=JSON.parse(response);
			var st = data["result"][0].ST;
			var ti = data["result"][0].TI;
			check("t_groupby",st,ti);						
		}
	});
	$("#totalCount").html("");
});

$("#gp_submit").click(function(){
	var esql_name = $("#esql_name").val();
	var y_content = $("#y_content").val();
	var gp_sql = $("#gp_esql").text();
	var con = getSearchCon();
	var table_name=tablename;
	var fromPox = date_histogram_group_sql.indexOf("from");
	var yVal = date_histogram_group_sql.substr(6,fromPox);

	console.info("put ssdb params:con="+con+"  tablename:"+table_name+"  yVal:"+yVal);
	params=[];
 	var oo={
            "name":esql_name,
            "con":con,          
            "table_name":table_name,
            "y_content":y_content,
            "x_type":x_type,
            "x_fields":x_fields,
            "x_values":x_values,
            "gp_sql":gp_sql
        };
	params.push(oo);
	// var params =[{"name":esql_name,"con":con,"table_name":tablename,"gp_sql":gp_sql}];	
    var	json = window.JSON.stringify(params);
	var key = "ke:"+esql_name;
	console.info("put ssdb json:"+json)
	$.ajax({
		url: "/db/put/ssdb0/"+key,
		type: "post",
    	data: {value:json},
    	dataType: "json",
    	success: function(res){    		
    		alert("保存成功！");
    	}
	});
	loadHasEsql();
})





function loadHasEsql(){
	$.ajax({
		type: "get",
        async: true,
        dataType:"jsonp",
        cache:false,
        url: "/db/scan/ssdb0/ke:/ke:~/100",             
        success: function(data) {
        	var names = [];	
			var nullname ='<option value="">选择已保存结构</option> ';
			names.push(nullname);
           	for (var i = 0; i < data.length; i++) {
           		var arr=data[i];
           		for(var j in data[i]){
           			var str=JSON.parse(arr[j]);
           			var name=str[0].name;
           			var gp_sql = str[0].gp_sql; 
           			// var li='<li class="list-group-item">'+name+'('+gp_sql+')</li>';    
           			// $("#sqllist").find("ul").append(li);     			
	       			var name_o ='<option value='+name+'>'+name+'</option> ';
	       			names.push(name_o);	
					$("#has_esql").html(names);		        		        		
           		}
           		
           	}     	
        },
        error:function(XMLHttpRequest,message){
			console.log(message)
		}
	 })
};

