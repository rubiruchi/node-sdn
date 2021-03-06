require('./lib/requires');
  
/* 
  make sure that a packet received on one port is sent on the other
*/
exports.testPortToPort = function(test) {
  var sw = new Hub(2);
  sw.getDevice(1).onSent(function() {
    test.ok(true);
    test.done();
  });
  sw.getDevice(0).receive(new Packet());
};

/*
  make sure that device doesn't send the packet it received
*/
exports.testNoLoopback = function(test) {
  var sw = new Hub(2),
  device = sw.getDevice(0),
  sent = false;

  device.onSent(function() { sent = true; });
  doAfter(500, function() {
    test.ok(!sent);
    test.done();
  });
  device.receive(new Packet());
};

/*
  make sure a packet received on one port on a Hub can
  traverse another connected Hub
*/
exports.testHubToHub = function(test) {
  var sw1 = new Hub(2), sw2 = new Hub(2);
  sw1.getDevice(1).connect(sw2.getDevice(0));
  sw2.getDevice(1).onSent(function(packet) {
    test.ok(true, 'other hub received packet');
    test.done();
  });
  sw1.getDevice(0).receive(new Packet());
};
