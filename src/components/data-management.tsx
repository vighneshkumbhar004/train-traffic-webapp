import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Plus, 
  Send,
  Download,
  Trash2,
  Train,
  Clock,
  Users,
  MapPin,
  Zap,
  ArrowRight,
  ArrowLeft,
  FileJson,
  Loader2
} from 'lucide-react';

const trainTypes = ['Express', 'Passenger', 'Freight', 'Local', 'Superfast'];

// TypeScript interfaces for backend communication
interface TrainData {
  trainId: string;
  departureTime: string;
  destination: string;
  delay: number;
  passengers: number;
  type: string;
  platform: number;
}

interface PredictionResponse {
  priority: string;
  confidence?: number;
  message?: string;
}

// Departure Model Input Interface
interface DepartureModelInput {
  id: string;
  trainId: string;
  type: string;
  delay: number;
  passengerCount: number;
  platform: number;
  departureTime: string;
  arrivalTime: string;
}

// Arrival Model Input Interface
interface ArrivalModelInput {
  id: string;
  trainId: string;
  type: string;
  passengerCount: number;
  arrivalTime: string;
  currentSpeed: number;
  distanceLeft: number;
}

interface Train {
  id: string;
  name: string;
  number: string;
  route: string;
  zone: string;
  status: string;
  currentLocation: string;
  nextStation: string;
  eta: string;
  delay: number;
  passengers: number;
  priority: string;
  type: string;
}

interface EmergencyAlert {
  id: string;
  type: string;
  severity: string;
  zone: string;
  description: string;
  time: string;
  status: string;
}

interface DataManagementProps {
  trains: Train[];
  emergencyAlerts: EmergencyAlert[];
  onTrainsUpdate: (trains: Train[]) => void;
  onAlertsUpdate: (alerts: EmergencyAlert[]) => void;
}

export default function DataManagement({ 
  trains, 
  emergencyAlerts, 
  onTrainsUpdate, 
  onAlertsUpdate 
}: DataManagementProps) {
  // Prediction result state
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Departure Model States
  const [departureInputs, setDepartureInputs] = useState<DepartureModelInput[]>([
    {
      id: 'dep_1',
      trainId: '',
      type: '',
      delay: 0,
      passengerCount: 0,
      platform: 1,
      departureTime: '',
      arrivalTime: ''
    }
  ]);

  // Arrival Model States
  const [arrivalInputs, setArrivalInputs] = useState<ArrivalModelInput[]>([
    {
      id: 'arr_1', 
      trainId: '',
      type: '',
      passengerCount: 0,
      arrivalTime: '',
      currentSpeed: 0,
      distanceLeft: 0
    }
  ]);

  // Add new departure input section
  const addDepartureInput = () => {
    setDepartureInputs(prev => [
      ...prev,
      {
        id: `dep_${Date.now()}`,
        trainId: '',
        type: '',
        delay: 0,
        passengerCount: 0,
        platform: 1,
        departureTime: '',
        arrivalTime: ''
      }
    ]);
  };

  // Add new arrival input section
  const addArrivalInput = () => {
    setArrivalInputs(prev => [
      ...prev,
      {
        id: `arr_${Date.now()}`,
        trainId: '',
        type: '',
        passengerCount: 0,
        arrivalTime: '',
        currentSpeed: 0,
        distanceLeft: 0
      }
    ]);
  };

  // Update departure input
  const updateDepartureInput = (id: string, field: keyof DepartureModelInput, value: any) => {
    setDepartureInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  // Update arrival input
  const updateArrivalInput = (id: string, field: keyof ArrivalModelInput, value: any) => {
    setArrivalInputs(prev => 
      prev.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  // Remove departure input
  const removeDepartureInput = (id: string) => {
    if (departureInputs.length > 1) {
      setDepartureInputs(prev => prev.filter(input => input.id !== id));
    }
  };

  // Remove arrival input
  const removeArrivalInput = (id: string) => {
    if (arrivalInputs.length > 1) {
      setArrivalInputs(prev => prev.filter(input => input.id !== id));
    }
  };

  // Send data to backend for prediction
  const handleSendData = async () => {
    const validInputs = departureInputs.filter(input => 
      input.trainId && input.type
    );
    
    if (validInputs.length === 0) {
      alert('Please fill at least one complete departure input');
      return;
    }

    // Prepare train data in the format expected by your backend
    const trainData: TrainData[] = validInputs.map(input => ({
      trainId: input.trainId,
      departureTime: input.departureTime || '00:00',
      destination: 'Destination Station', // You can modify this based on your needs
      delay: input.delay,
      passengers: input.passengerCount,
      type: input.type,
      platform: input.platform
    }));

    console.log('Sending data to backend:', trainData);
    
    setIsLoading(true);
    setPredictionResult(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trains: trainData,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const result: PredictionResponse = await response.json();
      console.log('Received prediction:', result);
      
      setPredictionResult(result);
      
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to connect to backend'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Export arrival data
  const exportArrivalData = () => {
    const validInputs = arrivalInputs.filter(input => 
      input.trainId && input.type
    );
    
    if (validInputs.length === 0) {
      alert('Please fill at least one complete arrival input');
      return;
    }

    const exportData = {
      model: 'arrival',
      trains: validInputs,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arrival-model-input-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ML Model Data Input</h1>
          <p className="text-muted-foreground">Configure input data for Departure and Arrival ML models</p>
        </div>
        <Button onClick={() => window.history.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="departure" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="departure" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Departure Model Input
          </TabsTrigger>
          <TabsTrigger value="arrival" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Arrival Model Input
          </TabsTrigger>
        </TabsList>

        {/* Departure Model Input Section */}
        <TabsContent value="departure" className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <ArrowRight className="h-5 w-5" />
                Departure Model Input Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Train className="h-4 w-4" />
                <AlertDescription>
                  Fill details for each train that will be processed by the Departure ML Model. 
                  Click "Add Train" to add more entries.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {departureInputs.map((input, index) => (
                  <Card key={input.id} className="border-2 border-dashed border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Train {index + 1}</CardTitle>
                        {departureInputs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDepartureInput(input.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Train ID */}
                        <div>
                          <Label htmlFor={`dep-train-id-${input.id}`}>Train ID *</Label>
                          <Input
                            id={`dep-train-id-${input.id}`}
                            value={input.trainId}
                            onChange={(e) => updateDepartureInput(input.id, 'trainId', e.target.value)}
                            placeholder="e.g., 12301"
                          />
                        </div>

                        {/* Type */}
                        <div>
                          <Label htmlFor={`dep-type-${input.id}`}>Type *</Label>
                          <Select 
                            value={input.type} 
                            onValueChange={(value) => updateDepartureInput(input.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {trainTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Delay */}
                        <div>
                          <Label htmlFor={`dep-delay-${input.id}`}>Delay (minutes)</Label>
                          <Input
                            id={`dep-delay-${input.id}`}
                            type="number"
                            min="0"
                            value={input.delay}
                            onChange={(e) => updateDepartureInput(input.id, 'delay', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Passenger Count */}
                        <div>
                          <Label htmlFor={`dep-passengers-${input.id}`}>Passenger Count</Label>
                          <Input
                            id={`dep-passengers-${input.id}`}
                            type="number"
                            min="0"
                            value={input.passengerCount}
                            onChange={(e) => updateDepartureInput(input.id, 'passengerCount', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>

                        {/* Platform */}
                        <div>
                          <Label htmlFor={`dep-platform-${input.id}`}>Platform</Label>
                          <Input
                            id={`dep-platform-${input.id}`}
                            type="number"
                            min="1"
                            value={input.platform}
                            onChange={(e) => updateDepartureInput(input.id, 'platform', parseInt(e.target.value) || 1)}
                            placeholder="1"
                          />
                        </div>

                        {/* Departure Time */}
                        <div>
                          <Label htmlFor={`dep-time-${input.id}`}>Departure Time</Label>
                          <Input
                            id={`dep-time-${input.id}`}
                            type="time"
                            value={input.departureTime}
                            onChange={(e) => updateDepartureInput(input.id, 'departureTime', e.target.value)}
                          />
                        </div>

                        {/* Arrival Time */}
                        <div>
                          <Label htmlFor={`dep-arrival-time-${input.id}`}>Arrival Time</Label>
                          <Input
                            id={`dep-arrival-time-${input.id}`}
                            type="time"
                            value={input.arrivalTime}
                            onChange={(e) => updateDepartureInput(input.id, 'arrivalTime', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Input Summary */}
                      {input.trainId && input.type && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">Ready for ML Model</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                            <span><strong>ID:</strong> {input.trainId}</span>
                            <span><strong>Type:</strong> {input.type}</span>
                            <span><strong>Delay:</strong> {input.delay}min</span>
                            <span><strong>Passengers:</strong> {input.passengerCount}</span>
                            <span><strong>Platform:</strong> {input.platform}</span>
                            <span><strong>Departure:</strong> {input.departureTime || 'Not set'}</span>
                            <span><strong>Arrival:</strong> {input.arrivalTime || 'Not set'}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button onClick={addDepartureInput} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Train
                  </Button>
                  <Button 
                    onClick={handleSendData} 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isLoading ? 'Sending...' : 'Send Data'}
                  </Button>
                </div>

                {/* Prediction Result Display */}
                {predictionResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium mb-2 text-green-800">Prediction Result</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Priority:</span>
                        <Badge variant={predictionResult.priority === 'High' ? 'destructive' : 'default'}>
                          {predictionResult.priority}
                        </Badge>
                      </div>
                      {predictionResult.confidence && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Confidence:</span>
                          <span>{predictionResult.confidence}%</span>
                        </div>
                      )}
                      {predictionResult.message && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Message:</span>
                          <span>{predictionResult.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Arrival Model Input Section */}
        <TabsContent value="arrival" className="space-y-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <ArrowLeft className="h-5 w-5" />
                Arrival Model Input Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Train className="h-4 w-4" />
                <AlertDescription>
                  Fill details for each train that will be processed by the Arrival ML Model. 
                  Click "Add Train" to add more entries.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {arrivalInputs.map((input, index) => (
                  <Card key={input.id} className="border-2 border-dashed border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Train {index + 1}</CardTitle>
                        {arrivalInputs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrivalInput(input.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Train ID */}
                        <div>
                          <Label htmlFor={`arr-train-id-${input.id}`}>Train ID *</Label>
                          <Input
                            id={`arr-train-id-${input.id}`}
                            value={input.trainId}
                            onChange={(e) => updateArrivalInput(input.id, 'trainId', e.target.value)}
                            placeholder="e.g., 12301"
                          />
                        </div>

                        {/* Type */}
                        <div>
                          <Label htmlFor={`arr-type-${input.id}`}>Type *</Label>
                          <Select 
                            value={input.type} 
                            onValueChange={(value) => updateArrivalInput(input.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {trainTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Passenger Count */}
                        <div>
                          <Label htmlFor={`arr-passengers-${input.id}`}>Passenger Count</Label>
                          <Input
                            id={`arr-passengers-${input.id}`}
                            type="number"
                            min="0"
                            value={input.passengerCount}
                            onChange={(e) => updateArrivalInput(input.id, 'passengerCount', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Arrival Time */}
                        <div>
                          <Label htmlFor={`arr-time-${input.id}`}>Arrival Time</Label>
                          <Input
                            id={`arr-time-${input.id}`}
                            type="time"
                            value={input.arrivalTime}
                            onChange={(e) => updateArrivalInput(input.id, 'arrivalTime', e.target.value)}
                          />
                        </div>

                        {/* Current Speed */}
                        <div>
                          <Label htmlFor={`arr-speed-${input.id}`}>Current Speed (km/h)</Label>
                          <Input
                            id={`arr-speed-${input.id}`}
                            type="number"
                            min="0"
                            value={input.currentSpeed}
                            onChange={(e) => updateArrivalInput(input.id, 'currentSpeed', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>

                        {/* Distance Left */}
                        <div>
                          <Label htmlFor={`arr-distance-${input.id}`}>Distance Left (km)</Label>
                          <Input
                            id={`arr-distance-${input.id}`}
                            type="number"
                            min="0"
                            step="0.1"
                            value={input.distanceLeft}
                            onChange={(e) => updateArrivalInput(input.id, 'distanceLeft', parseFloat(e.target.value) || 0)}
                            placeholder="0.0"
                          />
                        </div>
                      </div>

                      {/* Input Summary */}
                      {input.trainId && input.type && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">Ready for ML Model</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <span><strong>ID:</strong> {input.trainId}</span>
                            <span><strong>Type:</strong> {input.type}</span>
                            <span><strong>Passengers:</strong> {input.passengerCount}</span>
                            <span><strong>Arrival:</strong> {input.arrivalTime || 'Not set'}</span>
                            <span><strong>Speed:</strong> {input.currentSpeed} km/h</span>
                            <span><strong>Distance:</strong> {input.distanceLeft} km</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button onClick={addArrivalInput} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Train
                  </Button>
                  <Button onClick={exportArrivalData} variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Arrival Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departure Model Inputs</p>
                <p className="text-2xl font-bold text-blue-600">
                  {departureInputs.filter(input => input.trainId && input.type).length}
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Arrival Model Inputs</p>
                <p className="text-2xl font-bold text-green-600">
                  {arrivalInputs.filter(input => input.trainId && input.type).length}
                </p>
              </div>
              <ArrowLeft className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}