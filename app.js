var express = require('express');
var app = express();
var port = 3000;
const Influx = require('influx');
const influx = new Influx.InfluxDB('http://localhost:8086/personaDetails');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/influxData',function(req,res){
  influx.getMeasurements().then(response=>{
    console.log('response of measurement',response);
    res.send(response);
  });
});
app.post('/influxData',function(req,res){
  console.log('success:',req.body);
  influx.writePoints([req.body]).then(()=>{
    res.send('Given Details Created');
  });
});
app.post('/influxData/:measurement',function(req,res){
  influx.writeMeasurement(req.params.measurement,[req.body]).then(()=>{
    res.send('success');
  });
});

app.delete('/influxData',function(){
  influx.dropSeries({
    measurement:"datas",
    database: 'personaDetails'
  });
});
app.delete('/influxData/:measurement',function(req,res){
  influx.dropMeasurement(req.params.measurement);
  res.send('measurement deleted')
});
// influx.dropSeries({ where: userInfos => userInfos.tag('id').equals.value('id01') })
app.listen(port,function(){
  console.log('app running on port :',port);
});