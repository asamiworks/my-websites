// i-manabee UI Components
// このファイルからすべてのUIコンポーネントをエクスポートします

// Button Components
export {
  Button,
  ManabeeButton,
  JuniorButton,
  MiddleButton,
  SeniorButton,
  type ButtonProps
} from './Button';

// Card Components
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  JuniorCard,
  MiddleCard,
  SeniorCard,
  PlanCard,
  type CardProps,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps
} from './Card';

// Card Components (shadcn-style)
export {
  Card as CardShadcn,
  CardHeader as CardHeaderShadcn,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter as CardFooterShadcn
} from './card';

// Modal Components
export {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmationModal,
  JuniorModal,
  MiddleModal,
  SeniorModal,
  AlertModal,
  type ModalProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
  type ConfirmationModalProps,
  type AlertModalProps
} from './Modal';

// Alert Components
export {
  Alert,
  ManabeeAlert,
  JuniorAlert,
  MiddleAlert,
  SeniorAlert,
  SafetyAlert,
  type AlertProps,
  type SafetyAlertProps
} from './Alert';

// Alert Components (shadcn-style)
export {
  Alert as AlertShadcn,
  AlertDescription
} from './alert';

// Loading Components
export {
  Loading,
  FullPageLoading,
  CardSkeleton,
  MessageLoading,
  JuniorLoading,
  MiddleLoading,
  SeniorLoading,
  type LoadingProps
} from './Loading';

// Input Components
export {
  PinInput,
  type PinInputProps
} from './PinInput';

export { Input } from './input';

// Chat Components
export { ChatMessage } from '../chat/ChatMessage';
export { ChatInput } from '../chat/ChatInput';
export { UsageIndicator } from '../chat/UsageIndicator';

// Additional UI Components
export { Badge } from './badge';
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from './select';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from './dropdown-menu';