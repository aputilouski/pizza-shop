import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconCheck } from '@tabler/icons';

const notify = {
  success: (message: string) => showNotification({ message, color: 'green', icon: <IconCheck /> }),
  error: (message: string) => showNotification({ message, color: 'red', icon: <IconAlertCircle /> }),
};

export default notify;
