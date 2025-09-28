import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Train, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Zap,
  CloudRain,
  Navigation,
  Settings
} from 'lucide-react';
import DataManagement from './data-management';
import AIScheduling from './ai-scheduling';

// Mock data for Indian Railways
const zones = ['Northern', 'Southern', 'Western', 'Eastern', 'Central', 'North Eastern'];

const initialMockTrains = [
  {
    id: 'T001',
    name: 'Rajdhani Express',
    number: '12301',
    route: 'NEW DELHI → MUMBAI CENTRAL',
    zone: 'Western',
    status: 'On Time',
    currentLocation: 'Mathura Junction',
    nextStation: 'Agra Cantt',
    eta: '14:30',
    delay: 0,
    passengers: 1247,
    priority: 'High',
    type: 'Express'
  },
  {
    id: 'T002',
    name: 'Shatabdi Express',
    number: '12002',
    route: 'NEW DELHI → CHANDIGARH',
    zone: 'Northern',
    status: 'Delayed',
    currentLocation: 'Ambala Cantt',
    nextStation: 'Chandigarh',
    eta: '15:45',
    delay: 15,
    passengers: 891,
    priority: 'High',
    type: 'Express'
  },
  {
    id: 'T003',
    name: 'Chennai Express',
    number: '12624',
    route: 'NEW DELHI → CHENNAI CENTRAL',
    zone: 'Southern',
    status: 'On Time',
    currentLocation: 'Vijayawada Junction',
    nextStation: 'Gudur Junction',
    eta: '22:15',
    delay: 0,
    passengers: 1456,
    priority: 'Medium',
    type: 'Express'
  },
  {
    id: 'T004',
    name: 'Goods Train',
    number: 'GDS456',
    route: 'MUMBAI PORT → DELHI',
    zone: 'Central',
    status: 'Moving',
    currentLocation: 'Bhopal Junction',
    nextStation: 'Jhansi Junction',
    eta: '18:30',
    delay: 5,
    passengers: 0,
    priority: 'Low',
    type: 'Goods'
  }
];

const initialEmergencyAlerts = [
  {
    id: 'E001',
    type: 'Weather',
    severity: 'High',
    zone: 'Eastern',
    description: 'Heavy rainfall affecting Howrah-Sealdah section',
    time: '13:45',
    status: 'Active'
  },
  {
    id: 'E002',
    type: 'Technical',
    severity: 'Medium',
    zone: 'Western',
    description: 'Signal failure at Dadar Junction - Platform 3',
    time: '14:12',
    status: 'Resolved'
  }
];

export default function TrainDashboard() {
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [systemStatus, setSystemStatus] = useState('Operational');
  const [trainsOnTime, setTrainsOnTime] = useState(78);
  const [averageDelay, setAverageDelay] = useState(8.5);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for dynamic data
  const [trains, setTrains] = useState(initialMockTrains);
  const [emergencyAlerts, setEmergencyAlerts] = useState(initialEmergencyAlerts);

  useEffect(() => {
    if (!isRealTimeEnabled) return;
    
    // Simulate real-time updates - more controlled and realistic
    const interval = setInterval(() => {
      setTrainsOnTime(prev => Math.max(65, Math.min(95, prev + (Math.random() - 0.5) * 1.5)));
      setAverageDelay(prev => Math.max(2, Math.min(15, prev + (Math.random() - 0.5) * 1)));
    }, 10000); // Update every 10 seconds instead of 5

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-green-500';
      case 'Delayed': return 'bg-red-500';
      case 'Moving': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {activeTab === 'dashboard' ? (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Train className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Indian Railways Control Center</h1>
                <p className="text-muted-foreground">AI-Powered Traffic Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={systemStatus === 'Operational' ? 'default' : 'destructive'} className="px-3 py-1">
                <Zap className="h-3 w-3 mr-1" />
                {systemStatus}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {new Date().toLocaleTimeString()}
              </Badge>
              <Button 
                variant={isRealTimeEnabled ? "default" : "outline"} 
                size="sm"
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className="px-3 py-1"
              >
                {isRealTimeEnabled ? 'Live Data' : 'Static Data'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('management')}
                className="px-3 py-1"
              >
                <Settings className="h-3 w-3 mr-1" />
                Manage Data
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trains On Time</p>
                    <p className="text-2xl font-bold text-green-600">{trainsOnTime.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <Progress value={trainsOnTime} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Trains</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Train className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Delay (min)</p>
                    <p className="text-2xl font-bold text-orange-600">{averageDelay.toFixed(1)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Passengers</p>
                    <p className="text-2xl font-bold">2.3M</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Alerts */}
          {emergencyAlerts.filter(alert => alert.status === 'Active').length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Active Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {emergencyAlerts.filter(alert => alert.status === 'Active').map(alert => (
                  <Alert key={alert.id} className="border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span><strong>{alert.zone} Zone:</strong> {alert.description}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                            {alert.severity}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{alert.time}</span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="trains" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trains">Train Management</TabsTrigger>
              <TabsTrigger value="tracks">Track Utilization</TabsTrigger>
              <TabsTrigger value="schedule">AI Scheduling</TabsTrigger>
              <TabsTrigger value="emergency">Emergency Center</TabsTrigger>
            </TabsList>

            <TabsContent value="trains" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Trains</CardTitle>
                  <div className="flex gap-2">
                    <select 
                      className="border rounded px-3 py-1 text-sm"
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                    >
                      <option>All Zones</option>
                      {zones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trains.map(train => (
                      <div key={train.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(train.status)}`} />
                            <div>
                              <h3 className="font-semibold">{train.name} ({train.number})</h3>
                              <p className="text-sm text-muted-foreground">{train.route}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{train.zone}</Badge>
                            <Badge variant="secondary">{train.type}</Badge>
                            <Badge variant={train.priority === 'High' ? 'destructive' : 'default'}>
                              {train.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>Current: {train.currentLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-green-500" />
                            <span>Next: {train.nextStation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span>ETA: {train.eta} {train.delay > 0 && `(+${train.delay}min)`}</span>
                          </div>
                          {train.passengers > 0 && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-purple-500" />
                              <span>PAX: {train.passengers.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="outline" size="sm">Reschedule</Button>
                          {train.delay > 10 && (
                            <Button variant="secondary" size="sm" className="bg-red-100 text-red-700">
                              Optimize Route
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Track Utilization Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone, index) => {
                      // Use consistent utilization values instead of random ones
                      const baseUtilization = [75, 82, 68, 91, 73, 79];
                      const utilization = isRealTimeEnabled 
                        ? Math.max(60, Math.min(95, baseUtilization[index] + (Math.random() - 0.5) * 10))
                        : baseUtilization[index];
                      
                      return (
                        <Card key={zone} className="p-4">
                          <h3 className="font-semibold mb-2">{zone} Zone</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Track Utilization</span>
                              <span>{Math.floor(utilization)}%</span>
                            </div>
                            <Progress value={utilization} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {utilization > 85 ? 'High congestion' : utilization > 70 ? 'Moderate traffic' : 'Normal operations'}
                            </div>
                          </div>
                        </Card>
                      );
                    })} 
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <AIScheduling 
                trains={trains}
                onTrainsUpdate={setTrains}
              />
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Management Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CloudRain className="h-5 w-5 text-blue-500" />
                        Weather Monitoring
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Mumbai Region:</span>
                          <Badge variant="secondary">Clear</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Delhi Region:</span>
                          <Badge variant="secondary">Fog Warning</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Kolkata Region:</span>
                          <Badge className="bg-red-500">Heavy Rain</Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Active Incidents
                      </h3>
                      <div className="space-y-2">
                        {emergencyAlerts.map(alert => (
                          <div key={alert.id} className="text-sm border-l-4 border-red-500 pl-3">
                            <div className="font-medium">{alert.description}</div>
                            <div className="text-muted-foreground">{alert.zone} - {alert.time}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Stop All
                    </Button>
                    <Button variant="outline">
                      Broadcast Alert
                    </Button>
                    <Button variant="outline">
                      Contact Zone Control
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <DataManagement 
          trains={trains}
          emergencyAlerts={emergencyAlerts}
          onTrainsUpdate={setTrains}
          onAlertsUpdate={setEmergencyAlerts}
        />
      )}
    </div>
  );
}