import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';

const ErrorAlert = ({ title = 'Oops. Something went wrong', message }: { title?: string; message: string }) => (
  <Alert icon={<IconAlertCircle size={16} />} title={title} color="red">
    {message}
  </Alert>
);

export default ErrorAlert;
