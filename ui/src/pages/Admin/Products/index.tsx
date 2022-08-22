import React from 'react';
import { Button, Select, Table, Pagination } from '@mantine/core';
import ProductEditor from './ProductEditor';
import { PRODUCT, PRODCUCT_KEY } from 'utils';

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

const ProductManagment = () => {
  const [editor, setEditor] = React.useState<{ id?: string; opened: boolean }>({ opened: false });
  const [type, setType] = React.useState<PRODCUCT_KEY>(PRODUCT.KEYS[0]);

  const ths = (
    <tr>
      <th>Element position</th>
      <th>Element name</th>
      <th>Symbol</th>
      <th>Atomic mass</th>
    </tr>
  );

  const rows = elements.map(element => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  const selectData = React.useMemo(() => PRODUCT.KEYS.map(key => ({ value: key, label: PRODUCT.LABEL[key] })), []);

  return (
    <>
      <ProductEditor //
        type={type}
        id={editor.id}
        isCreation={!editor.id}
        opened={editor.opened}
        onClose={() => setEditor({ id: undefined, opened: false })}
      />

      <div className="flex gap-2 mb-8">
        <Select //
          value={type}
          data={selectData}
          onChange={type => (type ? setType(type as PRODCUCT_KEY) : undefined)}
        />

        <Button onClick={() => setEditor({ opened: true })}>Create</Button>
      </div>

      <Table striped highlightOnHover>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>

      <div className="my-8 flex justify-center">
        <Pagination radius="xl" total={10} />
      </div>
    </>
  );
};

export default ProductManagment;
