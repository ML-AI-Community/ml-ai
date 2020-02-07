CREATE EXTERNAL TABLE `yearly_sales`(                           
  `invoice_number` string,                                      
  `date` string,                                                
  `store_number` string,                                        
  `store_name` string,                                          
  `address` string,                                             
  `city` string,                                                
  `zip_code` string,                                            
  `store_location` string,                                      
  `county_number` string,                                       
  `county` string,                                              
  `category` string,                                            
  `category_name` string,                                       
  `vendor_number` string,                                       
  `vendor_name` string,                                         
  `item_number` string,                                         
  `item_description` string,                                    
  `pack` string,                                                
  `bottle_volume_ml` string,                                    
  `state_bottle_cost` string,                                   
  `state_bottle_retail` string,                                 
  `bottles_sold` string,                                        
  `sale_dollars` string,                                        
  `volume_sold_liters` string,                                  
  `volume_sold_gallons` string)                                 
PARTITIONED BY (                                                
  `batchdate` string)                                           
ROW FORMAT DELIMITED                                            
FIELDS TERMINATED BY ','                                      
LOCATION                                                        
  'hdfs path'   ;

