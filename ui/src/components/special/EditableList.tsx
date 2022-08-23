import React from 'react';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import { ThemeIcon, TextInput, Divider, CloseButton, ActionIcon } from '@mantine/core';
import { IconArrowsSort, IconPlus } from '@tabler/icons';

type EditableListItem = { key: string; value: string };

type EditableListProps = {
  label?: string;
  id?: string;
  value?: EditableListItem[];
  onUpdate?: (items: EditableListItem[]) => void;
};

const EditableList = ({ label, value = [], id, onUpdate }: EditableListProps) => {
  const [state, { reorder, append, setItem, remove }] = useListState(value);

  const [update, setUpdate] = React.useState(false);

  React.useEffect(() => {
    if (!update || !onUpdate) return;
    onUpdate(state);
    setUpdate(false);
  }, [update, onUpdate, state]);

  const action = React.useCallback(<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>): ReturnType<F> => {
    const result = fn(...args);
    setUpdate(true);
    return result;
  }, []);

  return (
    <DragDropContext onDragEnd={({ destination, source }) => action(reorder, { from: source.index, to: destination?.index || 0 })}>
      <Droppable droppableId={id || 'dnd-list'} direction="vertical">
        {(provided, snapshot) => (
          <div //
            className={clsx('border border-solid p-2.5 rounded border-gray-300 transition ease delay-100', snapshot.isDraggingOver && 'bg-gray-100')}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {label && <Divider label={label} labelPosition="center" className="mb-2" />}

            {state.map((item, index) => (
              <Draggable key={index} index={index} draggableId={`${id || 'dnd-list'}-item-${index}`}>
                {(provided, snapshot) => {
                  return (
                    <div //
                      className={clsx('py-1 flex items-center gap-2.5', snapshot.isDragging && 'bg-white opacity-70')}
                      {...provided.draggableProps}
                      ref={provided.innerRef}>
                      <ThemeIcon //
                        {...provided.dragHandleProps}
                        color="gray"
                        variant="light"
                        size={24}
                        className="cursor-grab">
                        <IconArrowsSort size={16} />
                      </ThemeIcon>

                      <TextInput //
                        placeholder="Value"
                        className="grow"
                        value={item.value}
                        onChange={e => action(setItem, index, { ...item, value: e.target.value })}
                      />

                      <TextInput //
                        placeholder="Key"
                        value={item.key}
                        onChange={e => action(setItem, index, { ...item, key: e.target.value })}
                      />

                      <CloseButton onClick={() => action(remove, index)} />
                    </div>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="mt-1">
              <ActionIcon variant="default" size={24} onClick={() => action(append, { key: '', value: '' })}>
                <IconPlus size={16} />
              </ActionIcon>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditableList;
