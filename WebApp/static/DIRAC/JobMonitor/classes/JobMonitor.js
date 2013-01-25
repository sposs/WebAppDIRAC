/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext
		.define(
				'DIRAC.JobMonitor.classes.JobMonitor',
				{
					extend : 'Ext.ux.desktop.Module',

					requires : [ 'Ext.data.JsonStore',
					             'Ext.util.*', 
					             'Ext.panel.Panel',
					             "Ext.ux.desktop.ToolButton",
					             "Ext.ux.form.MultiSelect"],					

					loadState : function(data) {
						
						var me = this;
						
						for(var i=0;i<me.grid.columns.length;i++){
							
							var col=me.grid.columns[i];
							col.setWidth(data.columns[col.getSortParam()].width);
							if(data.columns[col.getSortParam()].hidden)
								col.hide();
							else
								col.show();
							
							var sortState = data.columns[col.getSortParam()].sortState;
							
							if(sortState!=null)
								col.setSortState(sortState);
							
						}
						
						
						for(var i=0;i<me.selectorMenu.items.length;i++){
							
							var item=me.selectorMenu.items.getAt(i);
							
							item.setChecked(!data.selectors[item.relatedCmbField]);
							
							if(!data.selectors[item.relatedCmbField])
								me.cmbSelectors[item.relatedCmbField].show();
							else
								me.cmbSelectors[item.relatedCmbField].hide();
							
						}
						
						
						
					},

					getStateData : function() {
						
						
						var me = this;
						var oReturn = {};
						
						oReturn.columns={};
						
						for(var i=0;i<me.grid.columns.length;i++){
						
							var col=me.grid.columns[i];
							var oName = col.getSortParam();
							oReturn.columns[oName]={"width":col.width,"hidden":col.isHidden(),"sortState":col.sortState};
							
						}
						
						oReturn.selectors={};
						
						for(var cmb in me.cmbSelectors){
							
							oReturn.selectors[cmb]=me.cmbSelectors[cmb].isHidden();
							
						}
						
						return oReturn;

					},
					
					dataColumns : [
//					               {header:'',name:'checkBox',id:'checkBox',width:26,sortable:false,dataIndex:'JobIDcheckBox',renderer:chkBox,hideable:false,fixed:true,menuDisabled:true},
								    {header:'JobId',sortable:true,dataIndex:'JobID',align:'left',hideable:false},
//								    {header:'',width:26,sortable:false,dataIndex:'StatusIcon',renderer:status,hideable:false,fixed:true,menuDisabled:true},
								    {header:'Status',width:60,sortable:true,dataIndex:'Status',align:'left'},
								    {header:'MinorStatus',sortable:true,dataIndex:'MinorStatus',align:'left'},
								    {header:'ApplicationStatus',sortable:true,dataIndex:'ApplicationStatus',align:'left'},
								    {header:'Site',sortable:true,dataIndex:'Site',align:'left'},
								    {header:'JobName',sortable:true,dataIndex:'JobName',align:'left'},
								    {header:'LastUpdate [UTC]',sortable: true,renderer:"date",dataIndex:'LastUpdateTime'},
								    {header:'LastSignOfLife [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-d H:i'),dataIndex:'LastSignOfLife'},
								    {header:'SubmissionTime [UTC]',sortable:true,renderer:Ext.util.Format.dateRenderer('Y-m-d H:i'),dataIndex:'SubmissionTime'},
								    {header:'DIRACSetup',sortable:true,dataIndex:'DIRACSetup',align:'left',hidden:true},
								    {header:'FailedFlag',sortable:true,dataIndex:'FailedFlag',align:'left',hidden:true},
								    {header:'RescheduleCounter',sortable:true,dataIndex:'RescheduleCounter',align:'left',hidden:true},
								    {header:'CPUTime',sortable:true,dataIndex:'CPUTime',align:'left',hidden:true},
								    {header:'OwnerDN',sortable:true,dataIndex:'OwnerDN',align:'left',hidden:true},
								    {header:'JobGroup',sortable:true,dataIndex:'JobGroup',align:'left',hidden:true},
								    {header:'JobType',sortable:true,dataIndex:'JobType',align:'left',hidden:true},
								    {header:'AccountedFlag',sortable:true,dataIndex:'AccountedFlag',align:'left',hidden:true},
								    {header:'OSandboxReadyFlag',sortable:true,dataIndex:'OSandboxReadyFlag',align:'left',hidden:true},
								    {header:'Owner',sortable:true,dataIndex:'Owner',align:'left'},
								    {header:'TaskQueueID',sortable:true,dataIndex:'TaskQueueID',align:'left',hidden:true},
								    {header:'OwnerGroup',sortable:true,dataIndex:'OwnerGroup',align:'left',hidden:true}
					             ],
					dataFields:[
					            {name:'SystemPriority', type: 'float'},
					            {name:'ApplicationNumStatus'},
					            {name:'JobID', type: 'float'},
					            {name:'LastSignOfLife',type:'date',dateFormat:'Y-n-j h:i:s'},
					            {name:'VerifiedFlag'},
					            {name:'RetrievedFlag'},
					            {name:'Status'},
					            {name:'StartExecTime',type:'date',dateFormat:'Y-n-j h:i:s'},
					            {name:'RescheduleCounter'},
					            {name:'JobSplitType'},
					            {name:'MinorStatus'},
					            {name:'ApplicationStatus'},
					            {name:'SubmissionTime',type:'date',dateFormat:'Y-n-j h:i:s'},
					            {name:'JobType'},
					            {name:'MasterJobID'},
					            {name:'KilledFlag'},
					            {name:'RescheduleTime'},
					            {name:'DIRACSetup'},
					            {name:'FailedFlag'},
					            {name:'CPUTime'},
					            {name:'OwnerDN'},
					            {name:'JobGroup'},
					            {name:'JobName'},
					            {name:'AccountedFlag'},
					            {name:'OSandboxReadyFlag'},
					            {name:'LastUpdateTime',type:'date',dateFormat:'Y-n-j h:i:s'},
					            {name:'Site'},
					            {name:'HeartBeatTime',type:'date',dateFormat:'Y-n-j h:i:s'},
					            {name:'OwnerGroup'},
					            {name:'ISandboxReadyFlag'},
					            {name:'UserPriority'},
					            {name:'Owner'},
					            {name:'DeletedFlag'},
					            {name:'TaskQueueID'},
					            {name:'JobType'},
					            {name:'JobIDcheckBox',mapping:'JobID'},
					            {name:'StatusIcon',mapping:'Status'},
					            {name:'OwnerGroup'}],
					
					initComponent : function() {

						var me = this;
						me.launcher.title = "Job Monitor";
						/*
						 * Definition of containers
						 */
						
						me.leftPanel = new Ext.create('Ext.panel.Panel',{
						    title: 'Selectors',
						    region:'west',
						    floatable: false,
						    margins: '0',
						    width: 250,
						    minWidth: 230,
						    maxWidth: 350,
						    bodyPadding: 5
						});

						/*
						 * Definition of combo boxes
						 */
						
						me.cmbSelectors={site:null,
										status:null,
										minorStatus:null,
										appStatus:null,
										owner:null,
										jobGroup:null,
										jobType:null};
						
						var cmbTitles={site:"Site",
								status:"Status",
								minorStatus:"Minor Status",
								appStatus:"Application Status",
								owner:"Owner",
								jobGroup:"Job Group",
								jobType:"Job Type"};
						
						for(var cmb in me.cmbSelectors){
							
							me.cmbSelectors[cmb] = Ext.create('Ext.form.ComboBox', {
							    fieldLabel: cmbTitles[cmb],
							    store:[],
							    queryMode: 'local',
							    labelAlign:'top',
							    width:220
							});
							
							
						}
						
						me.leftPanel.add([me.cmbSelectors.site,
						                  me.cmbSelectors.status, 
						                  me.cmbSelectors.minorStatus, 
						                  me.cmbSelectors.appStatus,
						                  me.cmbSelectors.owner, 
						                  me.cmbSelectors.jobGroup, 
						                  me.cmbSelectors.jobType]);
						
						/*
						 * Multiselect with checkboxes
						 */
						
						me.exampleMultiSelect = new Ext.ux.form.MultiSelect({
							
				            msgTarget: 'side',
				            name: 'multiselect',
				            width:220,
				            allowBlank: true,
//				            store: [[123,'One Hundred Twenty Three'],
//				                    ['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
//				                    ['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
		                    store : new Ext.data.ArrayStore({
				                  fields : ['value', 'text'],
				                  data   : [
				                      ["AL", "Alabama"],
				                      ["AK", "Alaska"],
				                      ["AZ", "Arizona"]
				                  ]
				              }),
				            valueField:'value',
				            displayField:'text',
				            ddReorder: false,
				            listConfig: {
				            	selModel:new Ext.selection.DataViewModel({
					                mode: "MULTI",
					                selectWithEvent: function(record, e, keepExisting) {
					                    var me = this;

					                    switch (me.selectionMode) {
					                        case 'MULTI':
					                            if (e.ctrlKey && me.isSelected(record)) {
					                                me.doDeselect(record, false);
					                            } else if (e.shiftKey && me.lastFocused) {
					                                me.selectRange(me.lastFocused, record, e.ctrlKey);
					                            } else if (e.ctrlKey) {
					                                me.doSelect(record, true, false);
					                            } else if (me.isSelected(record) && !e.shiftKey && !e.ctrlKey){
					            					me.doDeselect(record, false);
					                            } else {
					                                me.doSelect(record, false);
					                            }
					                            break;
					                        case 'SIMPLE':
					                            if (me.isSelected(record)) {
					                                me.doDeselect(record);
					                            } else {
					                                me.doSelect(record, true);
					                            }
					                            break;
					                        case 'SINGLE':
					                            // if allowDeselect is on and this record isSelected, deselect it
					                            if (me.allowDeselect && me.isSelected(record)) {
					                                me.doDeselect(record);
					                            // select the record and do NOT maintain existing selections
					                            } else {
					                                me.doSelect(record, false);
					                            }
					                            break;
					                    }
					                },
					                
					                selectRange : function(startRow, endRow, keepExisting, dir){
					                    var me = this,
					                        store = me.store,
					                        selectedCount = 0,
					                        i,
					                        tmp,
					                        dontDeselect,
					                        records = [];

					                    if (me.isLocked()){
					                        return;
					                    }


					                    if (!keepExisting) {
					                        me.deselectAll(false);
					                    }


					                    if (!Ext.isNumber(startRow)) {
					                        startRow = store.indexOf(startRow);
					                    }
					                    if (!Ext.isNumber(endRow)) {
					                        endRow = store.indexOf(endRow);
					                    }

					                    // swap values
					                    if (startRow > endRow){
					                        tmp = endRow;
					                        endRow = startRow;
					                        startRow = tmp;
					                    }
					                    
					                    
					                    for (i = startRow; i <= endRow; i++) {
					                        if (me.isSelected(store.getAt(i))) {
					                            selectedCount++;
					                        }
					                    }

					                    if (!dir) {
					                        dontDeselect = -1;
					                    } else {
					                        dontDeselect = (dir == 'up') ? startRow : endRow;
					                    }

					                    for (i = startRow; i <= endRow; i++){
					                        if (selectedCount == (endRow - startRow + 1)) {
					                            if (i != dontDeselect) {
					                                me.doDeselect(i, true);
					                            }
					                        } else {
					                            records.push(store.getAt(i));
					                        }
					                    }

					                    me.doMultiSelect(records, true);
					                    
					                }
					             }),
				                // Custom rendering template for each item
				                getInnerTpl: function(displayField) {
				                	
				                	return '<div class="multselector-checkbox" style="float:left"></div><div style="float:left;padding:4px 0px 0px 5px">{'+displayField+'}</div><div style="clear:both"></div>';

				                },
				                listeners : {				                	

				                	//beforeselect:function(viewModel, record, eOpts){
				                	select:function(r, record, eOpts){
				                						                		
				                		//console.log("RECORD::SELECT");
				                		var node = this.getNode(record);
				                		
				                        if (node) {
				                        	var oPomElemId = Ext.fly(node).down("table").id;
				                        	var oCheckBox = Ext.getCmp(oPomElemId);
				                        	oCheckBox.setValue(true);
      	
				                        }

				                	},
				                	
				                	deselect:function(r, record, eOpts){
				                		
				                		//console.log("RECORD::DESELECT::"+record.data.field2);
				                		
				                		var node = this.getNode(record);
				                		
				                        if (node) {
				                        	var oPomElemId = Ext.fly(node).down("table").id;
				                        	var oCheckBox = Ext.getCmp(oPomElemId);
				                        	
				                        	oCheckBox.setValue(false);
				                        		                  	
				                        }
				                		
				                	},
				                	
				                	itemclick: function(viewObject, record, item, index, e, eOpts){
				                			
				                        if(e.target.nodeName=="INPUT")
				                        	e.ctrlKey = true;

				                	},
				                	refresh:function(){
				                		
				                		var me = this;
			                	        var renderSelector = Ext.query("#"+me.id+' div.multselector-checkbox'); 
		                	            for(var i in renderSelector){
		                	                Ext.create('Ext.form.field.Checkbox',{
		                	                    renderTo:renderSelector[i],
		                	                    multiListRef: me.exampleMultiSelect
		                	                });   
		                	            } 
			                	    }
				                }
			                	
				                	
				            }
							
						});
						
						
						var oInverseButton = new Ext.Button({
						    text: 'Inverse',
						    listeners:{
						    	
						    	click: function(btn,e,eOpt) {
						    		
								    		var oBoundList=btn.multiListRef.boundList;
						    				var oSelectionModel = oBoundList.getSelectionModel();
						    				var oAllRecords = oBoundList.getRecords(oBoundList.getNodes());
						    				var oSelectedRecords = oBoundList.getRecords(oBoundList.getSelectedNodes());
						    				
						    				var oInverseRecords=[];
						    				
						    				for(var i=0;i<oAllRecords.length;i++)
						    					if(!(oSelectionModel.isSelected(oAllRecords[i])))
						    						oInverseRecords.push(oAllRecords[i]);
						 
						    				oSelectionModel.select(oInverseRecords);
						    	
						    	}
						
						    },
						    multiListRef:me.exampleMultiSelect
						});
						
//						me.leftPanel.add(
//								{
//								
//									xtype:'panel',
//									width:220,
//									bodyBorder:false,
//									items:[	
//										{
//								            xtype: 'box',
//								            autoEl: {
//								                tag: 'span',
//								                html: 'Select: '
//								            }
//										},
//										oInverseButton
//									]
//								}
//						);
						
						me.leftPanel.add(me.exampleMultiSelect);
						
						if('function' !== typeof RegExp.escape) {
							/**
							* Escapes regular expression
							* @param {String} s
							* @return {String} The escaped string
							* @static
							*/
							RegExp.escape = function(s) {
								if('string' !== typeof s) {
									return s;
								}
								return s.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
							};
						}
						
						
						
						me.myCombo = new Ext.form.field.ComboBox({
						              queryMode    : 'local',
						              displayField : 'text',
						              valueField   : 'value',
						              store : new Ext.data.ArrayStore({
						                  fields : ['value', 'text'],
						                  data   : [
						                      ["AL", "Alabama"],
						                      ["AK", "Alaska"],
						                      ["AZ", "Arizona"],
						                      ["MK", "Makedonija"]
						                  ]
						              }),
						              displayField:"text",
						              valueField:"value",
						              width:220,
//						              store: [[123,'One Hundred Twenty Three'],
//							                    ['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
//							                    ['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
					                  multiSelect:true,
					                  visualseparator:this.separator,
					                  //suspendCheckChange:1,
					                  listeners:{
							              beforequery:function(oQuery,eOpts) {
						                	  oQuery.query = oQuery.query.replace(new RegExp(RegExp.escape(this.getCheckedDisplay()) + '[ ' + this.separator + ']*'), '');
						                	  //delete oQuery.combo.lastQuery;
						                  },
							              blur:function(comp,ev,eOpts) {
							            	  
						                	  	try{
						                		    this.getPicker().hide();
						                		}catch(e){}
						                		
						                		var rv = this.getRawValue();
						                		if(this.visualseparator){
						                			rv = rv.replace(new RegExp(this.visualseparator,"g"), this.separator);
						                		}
						                		var rva = rv.split(new RegExp(RegExp.escape(this.separator) + ' *'));
						                		var va = [];
						                		var snapshot = this.store.snapshot || this.store.data;

						                		// iterate through raw values and records and check/uncheck items
						                		Ext.each(rva, function(v) {
						                			snapshot.each(function(r) {
						                				if(v === r.get(this.displayField)) {
						                					va.push(r.get(this.valueField));
						                				}
						                			}, this);
						                		}, this);
						                		
						                		if(va.length == 1 && va[0] == 'All'){
						                		     this.setValue();
						                		}else{
						                		     this.setValue(va.join(this.separator));
						                		}
						                		this.store.clearFilter();
						                		
							              }
						              },
						              getRealValue:function(){
							                   var value = this.getValue().split(this.separator);
							                   return value
							          },
							          setCheckboxByRecord:function(record,oBool){
							      		  	
							        	  	if(oBool){
							        	  		
							        	  		this.getPicker().getSelectionModel().select([record]);
							        	  		
							        	  	}else{
							        	  		
							        	  		this.getPicker().getSelectionModel().deselect([record]);
							        	  		
							        	  	}
							        	  							      		  
							      	  },
							      	  getCheckboxByRecord:function(record){
							      		  
								      		return this.getPicker().getSelectionModel().isSelected(record);
					                        				      		  
							      	  },
							          getCheckedValue:function(field) {
							        	  field = field || this.valueField;
							        	  var c = [];

							        	  // store may be filtered so get all records
							        	  var snapshot = this.store.snapshot || this.store.data;

							        	  snapshot.each(function(r) {
							        		  if(this.getCheckboxByRecord(r)) {
							        			  c.push(r.get(field));
							        		  }
							        	  }, this);

							        	  return c.join(this.separator);
							          },
							      	  getCheckedDisplay:function() {
							      		  var re = new RegExp(this.separator, "g");
							      		  return this.getCheckedValue(this.displayField).replace(re, this.separator);
							      	  },
							      	 
								      clearValue:function() {
								      		this.value = '';
								      		this.setRawValue(this.value);
								      		this.store.clearFilter();
								      		this.store.each(function(r) {
								      			//r.set(this.checkField, false);
								      			this.setCheckboxByRecord(r,false);
								      		}, this);
								      		if(this.hiddenField) {
								      			this.hiddenField.value = '';
								      		}
								      		this.applyEmptyText();
								      },
								      onSelect:function(record, index) {
								          if(this.fireEvent('beforeselect', this, record, index) !== false){

											  // toggle checked field
											  //record.set(this.checkField, !record.get(this.checkField));
											  this.setCheckboxByRecord(record,!this.getCheckboxByRecord(record));
			
											  // display full list
											  if(this.store.isFiltered()) {
												  this.doQuery(this.allQuery);
											  }
			
											  // set (update) value
											  if( index == 0 && record.get(this.valueField) == 'All'){
												  if(this.getCheckboxByRecord(record)){
												       this.selectAll();
												  }else{
													  this.deselectAll();
												  }
											  }else{
											       this.setValue(this.getCheckedValue());
											  }
											  
											  this.setValue(this.getCheckedValue());
											
											  this.fireEvent('select', this, record, index);
								          }
								      },
								  	  setValue:function(v) {
										if(v) {
											v = '' + v;
											if(this.valueField) {
												this.store.clearFilter();
												this.store.each(function(r) {
													var checked = !(!v.match(
														 '(^|' + this.separator + ')' + RegExp.escape(r.get(this.valueField))
														+'(' + this.separator + '|$)'))
													;
													this.setCheckboxByRecord(r,checked);
													//r.set(this.checkField, checked);
												}, this);
												this.value = this.getCheckedValue();
												var t = this.getCheckedDisplay();
												if(this.visualseparator){
										            t = t.replace(new RegExp(this.separator,"g"), this.visualseparator);
										        }
												this.setRawValue(t);
												if(this.hiddenField) {
													this.hiddenField.value = this.value;
												}
											}else {
												this.value = v;
												var t = v;
												if(this.visualseparator){
										            t = t.replace(new RegExp(this.separator,"g"), this.visualseparator);
										        }
												this.setRawValue(t);
												if(this.hiddenField) {
													this.hiddenField.value = v;
												}
											}
//											if(this.el) {
//												this.el.removeClass(this.emptyClass);
//											}
										}else {
											this.clearValue();
										}
								  	  }, 
									
									  /**
									   * Selects all items
									   */
									  selectAll:function() {
								        this.store.each(function(record){
								            // toggle checked field
								            //record.set(this.checkField, true);
								            this.setCheckboxByRecord(record,true);
								        }, this);

								        //display full list
								        this.doQuery(this.allQuery);
								        this.setValue(this.getCheckedValue());
									  }, 
									
									  /**
									  * Deselects all items. Synonym for clearValue
									  */
									  deselectAll:function() {
										 this.clearValue();
									  }, 
								      
						              listConfig: {
							            	  
							            	selModel:new Ext.selection.DataViewModel({
								                mode: "MULTI",
								                selectWithEvent: function(record, e, keepExisting) {
								                    var me = this;

								                    switch (me.selectionMode) {
								                        case 'MULTI':
								                            if (e.ctrlKey && me.isSelected(record)) {
								                                me.doDeselect(record, false);
								                            } else if (e.shiftKey && me.lastFocused) {
								                                me.selectRange(me.lastFocused, record, e.ctrlKey);
								                            } else if (e.ctrlKey) {
								                                me.doSelect(record, true, false);
								                            } else if (me.isSelected(record) && !e.shiftKey && !e.ctrlKey){
								            					me.doDeselect(record, false);
								                            } else {
								                                me.doSelect(record, false);
								                            }
								                            break;
								                        case 'SIMPLE':
								                            if (me.isSelected(record)) {
								                                me.doDeselect(record);
								                            } else {
								                                me.doSelect(record, true);
								                            }
								                            break;
								                        case 'SINGLE':
								                            // if allowDeselect is on and this record isSelected, deselect it
								                            if (me.allowDeselect && me.isSelected(record)) {
								                                me.doDeselect(record);
								                            // select the record and do NOT maintain existing selections
								                            } else {
								                                me.doSelect(record, false);
								                            }
								                            break;
								                    }
								                },
								                
								                selectRange : function(startRow, endRow, keepExisting, dir){
								                    var me = this,
								                        store = me.store,
								                        selectedCount = 0,
								                        i,
								                        tmp,
								                        dontDeselect,
								                        records = [];

								                    if (me.isLocked()){
								                        return;
								                    }


								                    if (!keepExisting) {
								                        me.deselectAll(false);
								                    }


								                    if (!Ext.isNumber(startRow)) {
								                        startRow = store.indexOf(startRow);
								                    }
								                    if (!Ext.isNumber(endRow)) {
								                        endRow = store.indexOf(endRow);
								                    }

								                    // swap values
								                    if (startRow > endRow){
								                        tmp = endRow;
								                        endRow = startRow;
								                        startRow = tmp;
								                    }
								                    
								                    
								                    for (i = startRow; i <= endRow; i++) {
								                        if (me.isSelected(store.getAt(i))) {
								                            selectedCount++;
								                        }
								                    }

								                    if (!dir) {
								                        dontDeselect = -1;
								                    } else {
								                        dontDeselect = (dir == 'up') ? startRow : endRow;
								                    }

								                    for (i = startRow; i <= endRow; i++){
								                        if (selectedCount == (endRow - startRow + 1)) {
								                            if (i != dontDeselect) {
								                                me.doDeselect(i, true);
								                            }
								                        } else {
								                            records.push(store.getAt(i));
								                        }
								                    }

								                    me.doMultiSelect(records, true);
								                    
								                }
								             }),
							                // Custom rendering template for each item
							                getInnerTpl: function(displayField) {
							                	
							                	return '<div class="multselector-checkbox" style="float:left"></div><div style="float:left;padding:4px 0px 0px 5px">{'+displayField+'}</div><div style="clear:both"></div>';

							                },
							                listeners : {				                	

							                	//beforeselect:function(viewModel, record, eOpts){
							                	select:function(r, record, eOpts){
							                						                		
							                		//console.log("RECORD::SELECT");
							                		console.log("RECORD::SELECT::"+record.data.text);
							                		
							                		var node = this.getNode(record);
							                		
							                        if (node) {
							                        	var oPomElemId = Ext.fly(node).down("table").id;
							                        	var oCheckBox = Ext.getCmp(oPomElemId);
							                        	oCheckBox.setValue(true);
			      	
							                        }

							                	},
							                	
							                	deselect:function(r, record, eOpts){
							                		
							                		console.log("RECORD::DESELECT::"+record.data.text);
							                		
							                		var node = this.getNode(record);
							                		
							                        if (node) {
							                        	var oPomElemId = Ext.fly(node).down("table").id;
							                        	var oCheckBox = Ext.getCmp(oPomElemId);
							                        	
							                        	oCheckBox.setValue(false);
							                        		                  	
							                        }
							                		
							                	},
							                	
							                	itemclick: function(viewObject, record, item, index, e, eOpts){
							                		
							                        if(e.target.nodeName=="INPUT")
							                        	e.ctrlKey = true;

							                	},
							                	refresh:function(){
							                		
							                		var me = this;
						                	        var renderSelector = Ext.query("#"+me.id+' div.multselector-checkbox'); 
					                	            for(var i in renderSelector){
					                	                Ext.create('Ext.form.field.Checkbox',{
					                	                    renderTo:renderSelector[i],
					                	                    multiListRef: me.exampleMultiSelect
					                	                });   
					                	            } 
						                	    }
							                }
						                	
							                	
							            }
						          });
						
						me.leftPanel.add(me.myCombo);
						
//						var oButton = new Ext.Button({
//						    text: 'Check',
//						    listeners:{
//						    	
//						    	click: function(btn,e,eOpt) {
//						    				
//								    		alert(btn.multiListRef.getValue().toSource());
//								    		alert(btn.myCombo.getValue().toSource());
//						    	}
//						
//						    },
//						    multiListRef:me.exampleMultiSelect,
//						    myCombo:me.myCombo
//						});
//						me.leftPanel.add(oButton);
						/*
						 * Definition of grid
						 */
						
						me.dataStore = new Ext.data.JsonStore({
						    proxy: {
						        type: 'ajax',
						        url: this._baseUrl+'JobMonitor/getJobData',
						        reader: {
						            type: 'json',
						            root: 'result'
						        }
						    },

						    //alternatively, a Ext.data.Model name can be given (see Ext.data.Store for an example)
						    fields: me.dataFields,
						    autoLoad : true
						});
						
						me.grid = Ext.create('Ext.grid.Panel', {
							region: 'center',
						    store: me.dataStore,
						    columns: me.dataColumns
						});
						
						
						/*
						 * Structuring the main container
						 */
						Ext.apply(me, {
							layout : 'border',
							bodyBorder: false,
							defaults: {
							    collapsible: true,
							    split: true
							},
							items : [ me.leftPanel,me.grid ]
						});

						me.callParent(arguments);
						
					},
					
					afterRender:function(){
						var me=this;
						
						var menuItems=[];
						for(var cmb in me.cmbSelectors){
							
							menuItems.push({
						        xtype: 'menucheckitem',
						        text: me.cmbSelectors[cmb].getFieldLabel(),
						        relatedCmbField:cmb,
						        checked:true,
						        handler: function(item,e){
						        	
						        	var me=this;
						        	
						        	if(item.checked)
						        		me.cmbSelectors[item.relatedCmbField].show();
						        	else
						        		me.cmbSelectors[item.relatedCmbField].hide();
						        	
						        },
						        scope:me
						    });
							
						}
						
						me.selectorMenu = new Ext.menu.Menu({
							items : menuItems
						});
						
						me.leftPanel.getHeader().addTool({
							xtype : "toolButton",
							type : "save",
							menu : me.selectorMenu
						});
						
						this.callParent();
					}

				});