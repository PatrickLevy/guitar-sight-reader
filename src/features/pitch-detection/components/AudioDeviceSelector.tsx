import type { AudioInputDevice } from '../hooks/useMicrophone';

interface AudioDeviceSelectorProps {
  devices: AudioInputDevice[];
  selectedDeviceId: string | null;
  onDeviceChange: (deviceId: string | null) => void;
  disabled?: boolean;
}

export function AudioDeviceSelector({
  devices,
  selectedDeviceId,
  onDeviceChange,
  disabled = false,
}: AudioDeviceSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="audio-device" className="text-sm font-medium text-gray-700">
        Audio Input
      </label>
      <select
        id="audio-device"
        value={selectedDeviceId || ''}
        onChange={(e) => onDeviceChange(e.target.value || null)}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Default Microphone</option>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        Select your guitar input (microphone or audio interface)
      </p>
    </div>
  );
}
