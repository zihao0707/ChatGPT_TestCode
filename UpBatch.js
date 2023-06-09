﻿<!-- 查詢與預設 jqgrid -->
<script typeof="text/javascript">
    jQuery(function ($) {

        let item_id_array = new Map();
        let item_id;
        $(document).ready(function () {

            if ($('#work_code').val() === '') {
                // 將下拉選單隱藏
                $("#dropdown_checkbox").hide();
                $("#update_one_group").hide();
            } else {
                // 將下拉選單隱藏
                $("#dropdown_checkbox").show();
            }
      
            $(".exclusive-checkbox").change(function () {
                // 確保一次只能勾選一個選項
                $(".exclusive-checkbox").not(this).prop("checked", false);

                if ($(this).attr("id") == "all") {
                    if ($(this).is(":checked")) {
                        // 將下拉選單清空
                        $('#qtest_item_code_dropdown_menu input[type="checkbox"]').prop('checked', false);
                        // 將下拉選單隱藏
                        $("#qtest_item_code_dropdown").hide();
                        $("#update_one_group").hide();
                        // 將修改取消勾選
                        $("#update").prop("checked", false);
                        //將取代取消勾選
                        $("#update_one").prop("checked", false);
                        $("#qtest_item_code_dropdown").text("選擇檢驗項目");
                    } else {
                        // 還原預設狀態：全部覆蓋勾選
                        $("#all").prop("checked", true);
                    }
                } else if ($(this).attr("id") == "update") {
                    if ($(this).is(":checked")) {
                        // 將下拉選單顯示
                        $("#qtest_item_code_dropdown").show();
                        //將取代影藏
                        $("#update_one_group").hide();
                        // 將全部覆蓋取消勾選
                        $("#all").prop("checked", false);
                        //將取代取消勾選
                        $("#update_one").prop("checked", false);
                    } else {
                        // 還原預設狀態：全部覆蓋勾選
                        $("#all").prop("checked", true);
                        // 將下拉選單清空
                        $('#qtest_item_code_dropdown_menu input[type="checkbox"]').prop('checked', false);
                        // 將下拉選單隱藏
                        $("#update_one_group").hide();
                        $("#qtest_item_code_dropdown").hide();
                        $("#qtest_item_code_dropdown").text("選擇檢驗項目");
                    }
                } else if ($(this).attr("id") == "update_one") {
                    if ($(this).is(":checked")) {
                        // //將取代顯示
                        $("#update_one_group").show();
                        // 將下拉選單隱藏
                        $("#qtest_item_code_dropdown").hide();
                        // 將全部覆蓋取消勾選
                        $("#all").prop("checked", false);
                        // 將修改取消勾選
                        $("#update").prop("checked", false);
                    } else {
                        // 還原預設狀態：全部覆蓋勾選
                        $("#all").prop("checked", true);
                        // 將下拉選單清空
                        $('#qtest_item_code_dropdown_menu input[type="checkbox"]').prop('checked', false);
                        $("#update_one_group").hide();
                        // 將下拉選單隱藏
                        $("#qtest_item_code_dropdown").hide();
                    }
                }
            });
            //自動調整大小
            AdjustGridWidth("grid-table", "@actionName")
            function AdjustGridWidth(tableId) {
                let grid_selector = 'table[id^="' + tableId + '"]'
                var parent_column = $(grid_selector).closest('[class*="col-"]');
                $(grid_selector).jqGrid('setGridWidth', parent_column.width());
            }
        });

        $(document).on('click', '.delete_item', function () {

            var val = $(this).val()
            var index = $('.delete_item').index($(this))
            $('.qsheet_code').eq(index).remove()
            $('.item_name').eq(index).remove()
            $('.div_delete').eq(index).remove()

            Get_jqGrid();
            item_id_array.delete(val);

            // 加上延時才能刪掉row
            setTimeout(() => {
                item_id_array.forEach(function (item, key, mapObj) {
                    //console.log(mapObj);
                    delRow(item);
                });
            }, 500);

        })


        function delRow(rowId) {
            $('#grid-table').jqGrid('delRowData', rowId);
            //let status = $('#grid-table').jqGrid('delRowData', rowId);
            //console.log({ status: status, rowId: rowId });
        }


        //Make bootstrap modal draggable
        $(".modal").draggable({
            handle: ".modal-header",
        })
        $(".modal-header").css({
            'cursor': 'all-scroll'
        });

        // 點擊查詢按鈕 autofocus input
        $('#query_btn').click(function(){
            // 直接用 $('input[name="field_value"]').focus() 沒有作用
            setTimeout(function() {
                $('input[name="field_value"]').focus()
            }, 0);
        })

        // 清空條件
        $('#modal-form').find('.clear_query_all').click(function(){
            $('#query_sql_div').empty()
        })

        // 清除上一個條件
        $('#modal-form').find('.clear_query_last').click(function(){
            $('#query_sql_div').children().last().remove()
            $('input[name="field_value"]').focus()
        })

        // 點擊刪除
        $('#query_sql_div').on('click', 'button', function(){
            $(this).closest('.row').remove()
        })

        // 當下拉式選單收合時，更新選項的文字
        $("#qtest_item_code_dropdown_menu li label input[type='checkbox']").on("change", function () {
            var checked = $(this).prop("checked");
            var text = $(this).parent().text().trim();
            if (checked) {
                $("#qtest_item_code_dropdown").text(text + " ");
            } else {
                $("#qtest_item_code_dropdown").text("選擇檢驗項目");
            }
        });

        //// 當提交按鈕按下時，傳送選擇的項目
        //$("#submit-button").click(function () {
        //    var selectedItems = [];
        //    $("#qtest_item_code_dropdown_menu li label input[type='checkbox']").each(function () {
        //        if ($(this).prop("checked")) {
        //            selectedItems.push($(this).val());
        //        }
        //    });
        //    $.ajax({
        //        url: "/Controller/SubmitSelection",
        //        type: "POST",
        //        data: JSON.stringify(selectedItems),
        //        contentType: "application/json",
        //        success: function (data) {
        //            // 當提交成功後，執行一些操作
        //        }
        //    });
        //});

        function Get_NewRow(){
            let newRow = $(`
                <div class="row">
                    <div class="space-6"></div>
                    <div class="col-sm-3" >
                        <select class="form-control" id="" name="field_code">
                            @CustomHelper.Get_Option(query_DDL, "", false);
                        </select>
                    </div>
                    <div class="col-sm-2 no-padding-left">
                        <select class="form-control" id="" name="field_operator">
                            @CustomHelper.Get_Option(field_op_DDL, "", false)
                        </select>
                    </div>
                    <div class="col-sm-5 no-padding-left" >
                        <input type="text" name="field_value" placeholder="" class="col-sm-12">
                    </div>
                    <div class="col-sm-2 no-padding-left">
                        <button class="btn btn-danger btn-sm">
                            <i class="ace-icon fa fa-trash-o bigger-130"></i>
                            刪除
                        </button>
                    </div>
                </div>
            `)
            return newRow
        }

        // 點擊查詢類別
        $('#modal-form').find('input[name="query_type"]').click(function(){
            // 預設一個欄位
            $('#query_sql_div').empty()
            let newRow = Get_NewRow()
            $('#query_sql_div').append(newRow)
            $('input[name="field_value"]').focus()
        })

        // 新增查詢條件
        $('#modal-form').find('.add_query').click(function(){
            let newRow = Get_NewRow()
            $('#query_sql_div').append(newRow)
            $('input[name="field_value"]').focus()
        })

        // 欄位下拉
        $('#query_sql_div').on('change', 'select', function(){
            $('#modal-form').find('input[name="field_value"]').focus()
        })

        // 取得畫面上目前的查詢條件
        function Get_QueryData(){
            // 取得查詢類別
            let query_type = $('input[name="query_type"]:checked').val()

            // 設這查詢條件 陣列
            let query_conditions = []
            $('#query_sql_div').find('.row').each(function(){
                let field_code = $(this).find('select[name="field_code"]').val()
                let field_operator = $(this).find('select[name="field_operator"]').val()
                let input = $(this).find('input[name="field_value"]').val()
                let data = {
                    field_code: field_code,
                    field_operator: field_operator,
                    field_value: input
                };
                if (field_code){
                    query_conditions.push(data)
                }
            })
            let query_data = {
                query_type: query_type,
                query_conditions: query_conditions
            }
            return query_data
        }

        //儲存查詢條件
        function Set_QueryDatas(query_data) {
            let query_datas = []
            // 如果localStorage沒有資料或是空字串，
            if (!localStorage.getItem("query_datas_" + "@sPrgCode")){
                query_datas.push(query_data)
                localStorage.setItem("query_datas_" + "@sPrgCode", JSON.stringify(query_datas))

            } else {
                // 新查詢，直接覆蓋localStorage資料
                if (query_data.query_type.toUpperCase() == "NEW"){
                    query_datas.push(query_data)
                    localStorage.setItem("query_datas_" + "@sPrgCode", JSON.stringify(query_datas))
                } else {
                    // 增加查詢資料
                    query_datas = JSON.parse(localStorage.getItem("query_datas_" + "@sPrgCode"))
                    query_datas.push(query_data)
                    localStorage.setItem("query_datas_" + "@sPrgCode", JSON.stringify(query_datas))

                }
            }
        }

        function Get_QueryRow(field_data){
            let newRow = Get_NewRow()
            // 欄位參數
            newRow.find('select[name="field_code"]').children().each(function(){
                if ($(this).val() == field_data.field_code){
                    $(this).prop("selected", true)
                    return ;
                }
            })
            // 邏輯運算子
            newRow.find('select[name="field_operator"]').children().each(function(){
                if ($(this).val() == field_data.field_operator){
                    $(this).prop("selected", true)
                    return ;
                }
            })
            // 欄位值
            newRow.find('input[name="field_value"]').val(field_data.field_value)
            return newRow
        }

        // 點擊查詢
        $('#query_jqGrid').on('click', function(){
            // 如果localStorage沒有資料，但是點選保留或已查詢
            if (!localStorage.getItem("query_datas_" + "@sPrgCode")){
                let query_type = $('input[name="query_type"]:checked').val()
                if ( ["KEEP", "IN"].includes(query_type.toUpperCase()) ){
                    alert('請先選擇新查詢! ')
                    $('button[id="query_jqGrid"]').removeAttr('data-dismiss')
                    return ;
                } else {
                    $('button[id="query_jqGrid"]').attr('data-dismiss', 'modal')
                }
            }
            let current_queryData = Get_QueryData()
            Set_QueryDatas(current_queryData)
            // call jqgrid
            Get_jqGrid()
        })

        // 預設查詢狀態 / 查詢歷程
        if (localStorage.getItem("query_datas_" + "@sPrgCode")){
            // 取得localStorage的資料
            let query_datas = JSON.parse(localStorage.getItem("query_datas_" + "@sPrgCode"))
            let last_query = {};
            if (query_datas.length > 0) {
                last_query = query_datas[query_datas.length - 1];
                let query_type = last_query.query_type
                let query_conditions = last_query.query_conditions
                // 預設查詢狀態
                // 查詢類別
                $('#modal-form').find('input[name="query_type"]').each(function(){
                    if ($(this).val() == query_type) {  $(this).prop("checked", true)  }
                })

                // 清空條件
                $('#query_sql_div').empty()
                // 預設查詢欄位
                for (let i = 0; i < query_conditions.length; i++){
                    let query_row = Get_QueryRow(query_conditions[i])
                    $('#query_sql_div').append(query_row)
                }
                // 預設查詢狀態 end
            }
        }

        // 首頁 預設jqGrid
        Get_jqGrid()

        // jqGrid主體script
        function Get_jqGrid(){
            var query_datas = localStorage.getItem("query_datas_" + "@sPrgCode")

            // 如果不加 query_datas != "" 判斷，傳給controller 時 query_data會是null  why??
            if (query_datas != ""){
                // 傳給jqgrid的參數查詢資料
                let postData = {
                    pWhere: query_datas,
                    qsheet_code: $('#qsheet_code').val()
                }

                // 為了切換jqgrid，清除原來的jqgrid
                $('.ui-jqgrid').parent().append('<table id="grid-table"></table>');
                $('.ui-jqgrid').parent().append('<div id="grid-pager"></div>');
                $('.ui-jqgrid').remove();

                var grid_selector = "#grid-table";
                var pager_selector = "#grid-pager";
                var parent_column = $(grid_selector).closest('[class*="col-"]');

                // 預設寬度調整 ( 如果資料表BDP30_0000沒有對應資料 )
                @if (colWidth_list.Count <= 0)
                {
                <text>
                $(window).on('resize.jqGrid', function() {
                    $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                })
                </text>
                }

                //resize on sidebar collapse/expand
                $(document).on('settings.ace.jqGrid', function (ev, event_name, collapsed) {
                    if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
                        //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
                        setTimeout(function () {
                            $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                        }, 20);
                    }
                })

                var getColumnIndexByName = function (grid, columnName) {
                    var cm = grid.jqGrid('getGridParam', 'colModel'), i, l = cm.length;
                    for (i = 0; i < l; i++) {
                        if (cm[i].name === columnName) {
                            return i; // return the index
                        }
                    }
                    return -1;
                }

                //JqGrid本體主要設定
                jQuery(grid_selector).jqGrid({
                    url: "@Url.Action("Get_GridDataByQuery_Up", sPrgCode)",
                    mtype: "Post",
                    datatype: "json",
                    height: 'auto',
                    postData: postData,
                    //height: 300,
                    colNames: JSON.parse('@Html.Raw(Json.Encode(DisplayNameList))'),
                    colModel: [
                        {
                            name: 'myac', index: '', width: @( colWidth_list.Count > 0 ? colWidth_list[1].col_width : 35 ), sortable: false, fixed: true, //resize: false,
                            search: false,
                            formatter: 'actions',
                            formatoptions: {
                                delbutton: false,
                                editbutton: false
                            }
                        },
                        //下方為隱藏欄位
                        @for(int i = 0; i < ColumnInfoList.Count; i++)
                        {
                            switch (ColumnInfoList[i].name)
                            {
                                case "can_delete":
                                    <text>

                        { name: 'can_delete', index: 'can_delete', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "can_update":
                                    <text>
                        { name: 'can_update', index: 'can_update', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "qsheet_type_02":
                                    <text>
                        { name: 'qsheet_type_02', index: 'qsheet_type_02', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "qtest_level_code":
                                    <text>
                        { name: 'qtest_level_code', index: 'qtest_level_code', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "qtest_level_name":
                                    <text>
                        { name: 'qtest_level_name', index: 'qtest_level_name', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "ins_level_code":
                                    <text>
                        { name: 'ins_level_code', index: 'ins_level_code', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "ins_level_name":
                                    <text>
                        { name: 'ins_level_name', index: 'ins_level_name', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "work_code":
                                    <text>
                        { name: 'work_code', index: 'work_code', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "work_name":
                                    <text>
                        { name: 'work_name', index: 'work_name', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "epb_code":
                                    <text>
                        { name: 'epb_code', index: 'epb_code', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                case "epb_name":
                                    <text>
                        { name: 'epb_name', index: 'epb_name', width: 60, sorttype: "string", hidden: true },
                                                            </text>
                                    break;
                                default:
                                    <text>
                                                                {

                                                                    // 數字靠右
                                                                    @{
                                                                        string[] arrNum = new string[] { "int", "decimal", "double", "float"};
                                                                        for (int k = 0; k < arrNum.Length; k++) {
                                                                            if (ColumnInfoList[i].propertyType.ToLower().Contains(arrNum[k])) {
                                                                                <text>align: "right",</text>
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    // 金額千分位顯示
                                                                    @if (ColumnInfoList[i].dataType.ToLower() == "currency") {
                                                                    <text>
                                                                    //align: "right",
                                                                    formatter: 'integer',
                                                                    formatoptions: { thousandsSeparator: "," },
                                                                    </text>
                                                }
                                                                    name: "@ColumnInfoList[i].name", index: "@ColumnInfoList[i].name",
                                                                    width: @( colWidth_list.Count > 0 ? colWidth_list[i + 2].col_width : 60 ),
                                                                    hidden: @( is_show_list.Count > 0 ? (is_show_list[i + 2].is_show == "Y" ? "false": "true") : "false" ),
                                                                    sortype: "@ColumnInfoList[i].propertyType"
                                                                },
                                                                    </text>
                                                    break;
                                                    }
                                }
                    ],
                    viewrecords: true,
                    rowNum: "@comm.Get_QueryData("BDP00_0000", "page_count", "par_name", "par_value")" || 10000 ,
                    rowList: [10000, 20000, 30000],
                    pager: pager_selector,
                    altRows: true,
                    //toppager: true,
                    multiselect: true,
                    //multikey: "ctrlKey",
                    multiboxonly: true,
                    multiselectWidth: -30,  // hide checkbox column
                    loadonce: true,   // sort, change datatype to local
                    loadComplete: function () {
                        //讀取狀態
                        loadGridParameters($(grid_selector));

                        /* jqgrid 變色 */
                        // 格子包含文字
                        //$(this).find('td[aria-describedby="grid-table_pro_name"]:contains("三星")').css({'background-color': 'yellow'})
                        //// 格子數值條件
                        //$(this).find('td[aria-describedby="grid-table_pro_price"]')
                        //       .filter(function(index){ return parseInt($(this).text().replace(/[,]+/g, '')) > 10000 })
                        //       .css({'background-color': 'red'})

                        //// 整列
                        //$(this).find('td[aria-describedby="grid-table_pro_name"]:contains("華碩")').parent('tr').css({'background-color': 'grey'})


                        var table = this;
                        setTimeout(function () {
                            styleCheckbox(table);
                            updateActionIcons(table);
                            updatePagerIcons(table);
                            enableTooltips(table);


                        }, 0);

                        var iCol = getColumnIndexByName(jQuery(grid_selector), 'myac');
                        // 選擇按鈕
                        $(this).find(">tbody>tr.jqgrow>td:nth-child(" + (iCol + 1) + ")")
                        .each(function (rowId) {
                            if (true) {
                                $("<div>", {
                                    title: "選擇所選記錄",
                                    mouseover: function () {
                                        $(this).addClass('ui-state-hover');
                                    },
                                    mouseout: function () {
                                        $(this).removeClass('ui-state-hover');
                                    },
                                    click: function (e) {
                                        // Get data from selected row
                                        let id = $(e.target).closest("tr.jqgrow").attr("id")
                                        let data = jQuery(grid_selector).jqGrid('getRowData', id);
                                        item_id = data.qsheet_code;
                                        let newRow_qsheet_code = $(`
                                            <div class="form-group qsheet_code">
                                                <div class="col-sm-12">
                                                    <div class="clearfix">
                                                        <input type="text" class="col-sm-12" name="qsheet_code" value=${data.qsheet_code} readonly />
                                                    </div>
                                                </div>
                                            </div>
                                            `)
                                        $('[name=div_qsheet_code]').append(newRow_qsheet_code)

                                        let newRow_item_name = $(`
                                            <div class="form-group item_name" >
                                                <div class="col-sm-12">
                                                    <div class="clearfix">
                                                        <input type="text" class="col-sm-12" value="${data.qsheet_name}" readonly />
                                                    </div>
                                                </div>
                                            </div>
                                            `)
                                        $('[name=div_qsheet_name]').append(newRow_item_name)

                                        let newRow_delete = $(`
                                            <div class="form-group div_delete">
                                                <center>
                                                    <button class="delete_item btn btn-danger btn-sm" type="button" value=${data.qsheet_code}>
                                                        <i class="ace-icon fa fa-trash-o bigger-130"></i>
                                                        刪除
                                                    </button>
                                                </center>
                                            </div>
                                            `)
                                        $('[name=div_delete_qtest_item]').append(newRow_delete)

                                        $("#" + id).hide();
                                        item_id_array.set(item_id, id);
                                        console.log(item_id_array);


                                    }
                                }
                            ).css({ "margin-right": "8px", float: "left", cursor: "pointer" })
                                .addClass("ui-pg-div ui-inline-custom")
                                .append('<span name="chose_row" class="glyphicon glyphicon-ok blue"></span>')
                                .prependTo($(this).children("div"));
                            }
                        });
                    },
                    editurl: "",
                    onSelectRow: function (rowid) {
                        localStorage.setItem("selrowId", rowid)
                    }
                });

                $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size

                //enable search/filter toolbar

                //switch element when editing inline
                function aceSwitch(cellvalue, options, cell) {
                    setTimeout(function () {
                        $(cell).find('input[type=checkbox]')
                            .addClass('ace ace-switch ace-switch-5')
                            .after('<span class="lbl"></span>');
                    }, 0);
                }
                //enable datepicker
                function pickDate(cellvalue, options, cell) {
                    setTimeout(function () {
                        $(cell).find('input[type=text]')
                            .datepicker({ format: 'yyyy-mm-dd', autoclose: true });
                    }, 0);
                }

                //navButtons
                jQuery(grid_selector).jqGrid('navGrid', pager_selector,
                    { 	//navbar options
                        edit: false,
                        editicon: 'ace-icon fa fa-pencil blue',
                        add: false,
                        addicon: 'ace-icon fa fa-plus-circle purple',
                        del: false,
                        delicon: 'ace-icon fa fa-trash-o red',
                        search: true,
                        searchicon: 'ace-icon fa fa-search orange',
                        refresh: true,
                        refreshicon: 'ace-icon fa fa-refresh green',
                        view: true,
                        viewicon: 'ace-icon fa fa-search-plus grey'
                    },
                    {
                        //edit record form
                        //closeAfterEdit: true,
                        //width: 700,
                        recreateForm: true,
                        beforeShowForm: function (e) {
                            var form = $(e[0]);
                            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                            style_edit_form(form);
                        }
                    },
                            {
                                //new record form
                                //width: 700,
                                closeAfterAdd: true,
                                recreateForm: true,
                                viewPagerButtons: false,
                                beforeShowForm: function (e) {
                                    var form = $(e[0]);
                                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
                                    .wrapInner('<div class="widget-header" />')
                                    style_edit_form(form);
                                },
                                afterShowForm: function (form) {
                                    form.closest('div.ui-jqdialog').center();
                                },
                            },
                    {
                        // del
                        closeAfterEdit: true,
                        recreateForm: true,
                        beforeShowForm: function (e) {
                            var form = $(e[0]);
                            form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                            style_edit_form(form);
                        },
                        afterSubmit: function () { $(this).jqGrid('setGridParam', { datatype: 'json' }); return [true, ""] }
                    },
                    {
                        //search form
                        recreateForm: true,
                        afterShowSearch: function (e) {
                            var form = $(e[0]);
                            form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                            style_search_form(form);
                        },
                        afterRedraw: function () {
                            style_search_filters($(this));
                        }
                        ,
                        multipleSearch: true,
                        /**
                        multipleGroup:true,
                        showQuery: true
                        */
                    },
                    {
                        //view record form
                        recreateForm: true,
                        beforeShowForm: function (e) {
                            var form = $(e[0]);
                            form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                            form.closest('.ui-jqdialog').center()
                        },

                        afterSubmit: function () { $(this).jqGrid('setGridParam', { datatype: 'json' }); return [true, ""] }
                    }
                )

                // toolbar initial
                jQuery(grid_selector).jqGrid('filterToolbar', {
                    stringResult: true,
                    searchOnEnter: false
                });

                // toolbar style
                setTimeout(function () {
                    let search_toolbar = $('#gbox_' + grid_selector.substring(1)).find('.ui-search-toolbar').eq(0)
                    // set height
                    search_toolbar.css('height', '4em')
                    // set input placeholder and autocomplete off
                    let labels = $('#gbox_' + grid_selector.substring(1)).find('.ui-jqgrid-labels').eq(0);
                    let colName = "";
                    search_toolbar.find('th').find('input').attr('autocomplete', 'off');
                    search_toolbar.find('th').each(function (i) {
                        colName = labels.find('th').eq(i).text();
                        $(this).find('input').attr('placeholder', '搜尋 ' + colName)
                    })

                    // restore jqgrid toolbar values
                    if (localStorage.getItem($(grid_selector).jqGrid('getGridParam', 'url'))){
                        let gridInfo = JSON.parse(localStorage.getItem($(grid_selector).jqGrid('getGridParam', 'url')));
                        if (gridInfo.postData.filters != null && gridInfo.postData.filters != "") {
                            let filters = JSON.parse(gridInfo.postData.filters);
                            let rules = filters.rules;
                            for (let i = 0; i < rules.length; i++) {
                                $('.ui-search-toolbar').find("input[name=" + rules[i].field + "]").val(rules[i].data)
                            }
                        }
                    }
                },

                50)
                // *** JqGrid Persist State *** //
                // jqgrid save state function
                function saveGridParameters(grid) {
                    // Load GridParam
                    let gridInfo = new Object();

                    gridInfo.url = grid.jqGrid('getGridParam', 'url');
                    gridInfo.sortname = grid.jqGrid('getGridParam', 'sortname');
                    gridInfo.sortorder = grid.jqGrid('getGridParam', 'sortorder');
                    //gridInfo.selrow = grid.jqGrid('getGridParam', 'selrow');
                    gridInfo.page = grid.jqGrid('getGridParam', 'page');
                    gridInfo.rowNum = grid.jqGrid('getGridParam', 'rowNum');
                    gridInfo.postData = grid.jqGrid('getGridParam', 'postData');
                    gridInfo.search = grid.jqGrid('getGridParam', 'search');

                    let ids = [];
                    grid.find("tr:has(.sgexpanded)").each(function () {
                        ids.push($(this).attr('id'));
                    });
                    gridInfo.subgridIds = ids;

                    // Serialize it to as JSON-String
                    let gridParams = JSON.stringify(gridInfo);

                    // Save the serialized Griddata in the localStorage
                    //localStorage.setItem("gridParams", gridParams);
                    localStorage.setItem(grid.jqGrid('getGridParam', 'url'), gridParams);
                };

                // jqgrid load state function
                function loadGridParameters(grid) {

                    // jqgrid state save
                    let url = grid.jqGrid('getGridParam', 'url')
                    if (localStorage.getItem(url) != "" && localStorage.getItem(url) != null) {
                        let gridInfo = JSON.parse(localStorage.getItem(url));
                        //var $this = $(this);

                        let $this = grid;
                        // selrow
                        $this.jqGrid('setSelection', localStorage.getItem("selrowId"), false);

                        if ($this.jqGrid("getGridParam", "datatype") === "json") {
                            setTimeout(function () {

                                $this.jqGrid("setGridParam", {
                                    datatype: "local",
                                    page: gridInfo.page,
                                    //postData: gridInfo.postData,
                                    sortname: gridInfo.sortname,
                                    sortorder: gridInfo.sortorder,
                                    //rowNum: gridInfo.rowNum,
                                    search: gridInfo.search
                                });
                                if (gridInfo.postData.filters != "" && gridInfo.postData.filters != null) {
                                    let rules = JSON.parse(gridInfo.postData.filters).rules;
                                    if (rules != [] && rules != "") {
                                        $this.jqGrid("setGridParam", {
                                            postData: gridInfo.postData,

                                        });
                                    }
                                }
                                $this.trigger("reloadGrid");
                            }, 50);

                        }
                        // retain subgrid expand
                        if (gridInfo.subgridIds != null && gridInfo.subgridIds != []) {
                            for (var j = 0; j < gridInfo.subgridIds.length; j = j + 1) {
                                $this.jqGrid('expandSubGridRow', gridInfo.subgridIds[j]);
                            }
                        }
                        // end

                    }
                }

                function DisplayRowNum() {
                    if (localStorage.getItem("gridParams") != "" && localStorage.getItem("gridParams") != null) {
                        let gridInfo = JSON.parse(localStorage.getItem("gridParams"));
                        return gridInfo.rowNum;
                    }
                }

                // save jqgrid state
                window.addEventListener("beforeunload", function (event) {

                    saveGridParameters(jQuery(grid_selector))

                });

                // *** JqGrid Persist State End *** //

                // reset jqgrid params
                $('#refresh_grid-table').click(function () {
                    localStorage.setItem("gridParams", "");
                    localStorage.setItem("selrowId", "");
                    localStorage.setItem($(grid_selector).jqGrid('getGridParam', 'url'), "");
                    $(grid_selector).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid')
                })

                function style_delete_form(form) {
                    var buttons = form.next().find('.EditButton .fm-button');
                    buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
                    buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
                    buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
                }

                function style_search_filters(form) {
                    form.find('.delete-rule').val('X');
                    form.find('.add-rule').addClass('btn btn-xs btn-primary');
                    form.find('.add-group').addClass('btn btn-xs btn-success');
                    form.find('.delete-group').addClass('btn btn-xs btn-danger');
                }
                function style_search_form(form) {
                    var dialog = form.closest('.ui-jqdialog');
                    var buttons = dialog.find('.EditTable')
                    buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
                    buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
                    buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
                }

                function beforeDeleteCallback(e) {
                    var form = $(e[0]);
                    if (form.data('styled')) return false;
                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                    style_delete_form(form);
                    form.data('styled', true);
                }

                function beforeEditCallback(e) {
                    var form = $(e[0]);
                    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                    style_edit_form(form);
                }
                function styleCheckbox(table) {
                    /**
                        $(table).find('input:checkbox').addClass('ace')
                        .wrap('<label />')
                        .after('<span class="lbl align-top" />')

                        $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
                        .find('input.cbox[type=checkbox]').addClass('ace')
                        .wrap('<label />').after('<span class="lbl align-top" />');
                    */
                }
                function updateActionIcons(table) {
                    /**
                    var replacement =
                    {
                        'ui-ace-icon fa fa-pencil' : 'ace-icon fa fa-pencil blue',
                        'ui-ace-icon fa fa-trash-o' : 'ace-icon fa fa-trash-o red',
                        'ui-icon-disk' : 'ace-icon fa fa-check green',
                        'ui-icon-cancel' : 'ace-icon fa fa-times red'
                    };
                    $(table).find('.ui-pg-div span.ui-icon').each(function(){
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
                        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
                    })
                    */
                }

                //replace icons with FontAwesome icons like above
                function updatePagerIcons(table) {
                    var replacement =
                    {
                        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
                        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
                        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
                        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
                    };
                    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
                        var icon = $(this);
                        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

                        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
                    })
                }

                function enableTooltips(table) {
                    $('.navtable .ui-pg-button').tooltip({ container: 'body' });
                    $(table).find('.ui-pg-div').tooltip({ container: 'body' });
                }


                //var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

                $(document).one('ajaxloadstart.page', function (e) {
                    $.jgrid.gridDestroy(grid_selector);
                    $('.ui-jqdialog').remove();
                });
                $('#gbox_grid-table').css({width: parent_column.width()})

            } // jqgrid script end
        }
    }) // jQuery(function(){ ... }) end
</script>

<!-- jqgrid column width -->
<script type="text/javascript">
    jQuery(function ($) {
        // save current width
        $('#saveCurrentWidth').click(function () {
            // 主jqgrid
            SaveColWidth("grid-table", "@actionName")
            // subgrid
            SaveColWidth("grid-table_", "@actionName" + "_D1")
        })

        // fit to page size
        $('#defaultWidth').click(function () {
            AdjustGridWidth("grid-table", "@actionName")
        })

        function AdjustGridWidth(tableId){
            let grid_selector = 'table[id^="' + tableId + '"]'
            var parent_column = $(grid_selector).closest('[class*="col-"]');
            $(grid_selector).jqGrid('setGridWidth', parent_column.width());
        }

        function SaveColWidth(tableId, viewCode){
            let grid_selector = 'table[id^="' + tableId + '"]'
            // get jqGrid colModel
            let colModel = $(grid_selector).jqGrid('getGridParam', 'colModel');
            // if colModel is not undefined
            if (colModel){
                // set col_index and col_width
                let arr = [];
                for (let i = 0 ; i < colModel.length; i++) {
                    let data = {
                        prg_code: '@sPrgCode',
                        view_code: viewCode,
                        col_index: i,
                        col_width: colModel[i].width
                    }
                    arr.push(data)
                }
                // save data to db
                postData = JSON.stringify({ list: arr })
                $.ajax({
                    method: 'post',
                    url: '@Url.Action("AddEdit", "BDP300A")',
                    data: postData,
                    contentType: 'application/json; charset=utf-8',
                    //dataType: 'json',
                    success: function (msg) {
                        //alert(msg)
                        history.go(0)  //刷新頁面
                    },
                    error: function (xhr) {
                        alert('ajax error! ' + xhr.status + ': ' + xhr.statusText )
                    }

                })
            }
        }
    })
</script>

<!-- jqgrid column hidden -->
<script>
    jQuery(function ($) {
        $.extend(true, $.ui.multiselect, {
            locale: {
                // addAll btn has problem
                addAll: '',
                removeAll: '',
                itemsCount: '個選擇欄位'
            }
        });

        $('#columnChooser').click(function(){
            CallColumnChooser('grid-table', '@actionName')
        })

        $('#sub_columnChooser').click(function(){
            CallColumnChooser('grid-table_', '@actionName' + '_D1')
        })

        function CallColumnChooser(tableId, viewCode){
            let grid_selector = 'table[id^="' + tableId + '"]'
            // get jqGrid colModel
            let colModel = $(grid_selector).jqGrid('getGridParam', 'colModel');
            // if colModel is not undefined
            if (colModel){
                $(grid_selector).jqGrid('columnChooser', {
                    modal: true,
                    done: function(perm){
                        if (perm) {
                            //this.jqGrid("remapColumns", perm, false);

                            // get current jqGrid colModel
                            let current_colModel = $(grid_selector).jqGrid('getGridParam', 'colModel');

                            //set column hidden state
                            let arr = [];
                            for (let i = 0 ; i < current_colModel.length; i++) {
                                let data = {
                                    prg_code: '@sPrgCode',
                                    view_code: viewCode,
                                    col_index: i,
                                    is_show: current_colModel[i].hidden ? 'N' : 'Y'
                                }
                                arr.push(data)
                            }
                            // save data to db
                            postData = JSON.stringify({ list: arr })
                            $.ajax({
                                method: 'post',
                                url: '@Url.Action("InsertUpdateIsShow", "BDP300A")',
                                data: postData,
                                contentType: 'application/json; charset=utf-8',
                                //dataType: 'json',
                                success: function (msg) {
                                    //alert(msg)
                                    history.go(0)  //刷新頁面
                                },
                                error: function (xhr) {
                                    alert('ajax error! ' + xhr.status + ': ' + xhr.statusText )
                                }

                            })
                        }
                    }
                })
            }else {
                switch(tableId){
                    case 'grid-table':
                        msg = '請查詢主檔資料! '
                        break;
                    case 'grid-table_':
                        msg = '請打開明細表格! '
                        break;
                    default:
                        msg = '當前畫面沒有秀出表格! '
                        break;
                }
                alert(msg)
            }

        }

    })

    $('.chose_row').click(function(){

    })


    $('#work_code').change(function () {

        if ($('#work_code').val() === '') {
                // 將下拉選單隱藏
            $("#dropdown_checkbox").hide();
            } else {
                // 將下拉選單隱藏
            $("#dropdown_checkbox").show();
            }

        $("#qtest_item_code_dropdown").text("選擇檢驗項目");
         var selected_work_code = $(this).val();
         let Qsheet_Code = $('#qsheet_code').val();
        $.ajax({
            type: "POST",
            url: '@Url.Action("GetQTestItemCodes")', // 呼叫的Controller Action
            data: {
                "selected_work_code": selected_work_code,
                "QsheetCode": Qsheet_Code
            },
            dataType: "json",
            success: function (data) {
                console.log(data)
                var qtest_item_code_dropdown_menu = $("#qtest_item_code_dropdown_menu");
                qtest_item_code_dropdown_menu.empty(); // 清空原有選單內容
                $.each(data, function (index, value) {
                    var q_code = value.qtest_item_code;
                    var q_name = q_code + " - " + value.qtest_item_name;
                    var checkbox = $("<input>").attr("type", "checkbox").attr("name", "qtest_item_code").attr("value", q_code);
                    var label = $("<label>").append(checkbox).append($("<a>").text(q_name));
                    qtest_item_code_dropdown_menu.append($("<li>").append(label));
                });
            },
            error: function (data) {
                console.log("Error occurred while getting QTest Item codes.");
            }
            }).done(function(){
            // $.ajax() 呼叫成功後的處理
            // 觸發 chosen 更新選項
            //$('#qtest_item_code_dropdown_menu').trigger("chosen:updated");
        });
    });

    $('#qtest_item_code_update_list').change(function () {

        let value = $('#qtest_item_code_update_list').val()

        $('#qtest_item_code_update_value').val(value) 
    });


	$("form").submit(function () {
        if (!$("input[name='qtest_item_code']:checked").length && $("#update").is(":checked")) {
            alert("請選擇檢驗項目");
            return false;
        }
        if ($('#work_code').val() === '') {
            alert("請選擇製程");
            return false;
        }
        if ($("#update_one").is(":checked") && ($('#qtest_item_code_update_value').val() === '' || $('#qtest_item_code_update_list').val() === '')) {
            alert("請選擇並輸入需取代的檢驗項目");
            return false;
        }
        else {
            $('input[type=submit], a').attr('disabled', 'disabled');
        }
    });

	// chosen select
    if (!ace.vars['touch']) {
        $('.chosen-select').chosen({ allow_single_deselect: true });
        //resize the chosen on window resize

        $(window)
            .off('resize.chosen')
            .on('resize.chosen', function () {
                $('.chosen-select').each(function () {
                    var $this = $(this);
                    $this.next().css({ 'width': $this.parent().width() });
                })
            }).trigger('resize.chosen');
        //resize chosen on sidebar collapse/expand
        $(document).on('settings.ace.chosen', function (e, event_name, event_val) {
            if (event_name != 'sidebar_collapsed') return;
            $('.chosen-select').each(function () {
                var $this = $(this);
                $this.next().css({ 'width': $this.parent().width() });
            })
        });
    }

</script>
