var express = require('express');
var app = express();
var port = 3000;
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://localhost:8086/personaDetails');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// getting measurements in particular db
app.get('/influxData',function(req,res){
  influx.getMeasurements().then(response=>{
    console.log('response of measurement',response);
    res.send(response);
  });
});
// creating measurements
app.post('/influxData',function(req,res){
  console.log('success:',req.body);
  influx.writePoints([req.body]).then(()=>{
    res.send('Given Details Created');
  });
});
// creating measurements by sending name in url
app.post('/influxData/:measurement',function(req,res){
  influx.writeMeasurement(req.params.measurement,[req.body]).then(()=>{
    res.send('success');
  });
});

// deleting series
app.delete('/influxData',function(){
  influx.dropSeries({
    measurement:"datas",
    database: 'personaDetails'
  });
});

// deleting measurement
app.delete('/influxData/:measurement',function(req,res){
  influx.dropMeasurement(req.params.measurement);
  res.send('measurement deleted')
});

// deleting database
app.delete('/influxData/remove/:db',function(req,res){
  influx.dropDatabase(req.params.db).then(()=>{
    console.log('Databse Deleted');
    res.send('Databse Deleted');
  });
});
// influx.dropSeries({ where: userInfos => userInfos.tag('id').equals.value('id01') })
app.listen(port,function(){
  console.log('app running on port :',port);
});