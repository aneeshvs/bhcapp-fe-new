'use client';
import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from 'react';

// Props interface
interface DropdownProps {
  btnClassName?: string;
  button: ReactNode;
  children: ReactNode;
  placement?: 'bottom-end' | 'bottom-start';
  offset?: [number, number];
}

// Ref interface exposed to parent
export interface DropdownRef {
  close: () => void;
}

const Dropdown = forwardRef<DropdownRef, DropdownProps>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Expose close method to parent via ref
  useImperativeHandle(ref, () => ({
    close: () => setVisible(false),
  }));

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={buttonRef}
        className={props.btnClassName}
        onClick={() => setVisible(!visible)}
      >
        {props.button}
      </button>

      {visible && (
        <div
          ref={dropdownRef}
          className="z-50"
          style={{
            position: 'absolute',
            top: '100%',
            right: props.placement === 'bottom-end' ? 0 : undefined,
            left: props.placement === 'bottom-start' ? 0 : undefined,
            marginTop: props.offset?.[1] || 8,
            minWidth: '150px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '8px',
            zIndex: 1000,
          }}
          onClick={() => setVisible(false)}
        >
          {props.children}
        </div>
      )}
    </div>
  );
});
Dropdown.displayName = 'Dropdown';
export default Dropdown;
