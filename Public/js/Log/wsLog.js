/**
 * Created by Administrator on 2017/6/9.
 */
    $(function(){
        var time=new Date();
        $('#etime').datetimebox({value:new Time(time,0).init()});
        $('#btime').datetimebox({value:new Time(time,7).init()});
        $('#datagrid').datagrid({
            url:app.url('Log/ws_log_list'),
            title:'工作站日志',
            fitColumns:true,
            fit:true,
            striped:true,
            rownumbers:true,
            pagination:true,
            pageSize:15,
            pageNumber:1,
            pageList:[2,5,10,15,20,25,30,40,50],
            pagePosition:'bottom',
            toolbar:'#toolbar',
            columns:[[
                {field:'id',title:'',checkbox:true},
                {field:'wsname',title:'工作站',width:100,align:'center'},
                {field:'name',title:'警员编号',width:100,align:'center'},
                {field:'action',title:'日志类型',width:100,align:'center'},
                {field:'rzsj',title:'日志时间',width:100,align:'center'}
            ]]
        });
        $('#searching').click(function(){
            var data=app.serializeJson('#form');
            //if(data.btime>data.etime){
            //    $.messager.alert('操作提示','初始时间不能大于结束时间，请重新选择','info');
            //    return false;
            //}
            $('#datagrid').datagrid({
                queryParams:data
            });
        });
    });

