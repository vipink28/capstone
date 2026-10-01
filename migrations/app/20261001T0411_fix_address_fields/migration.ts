#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/747d309e8b612abe096a4c50041ca4421463f70b8bba18a987531d2200d429b5/contract';
import endContract from '../../snapshots/747d309e8b612abe096a4c50041ca4421463f70b8bba18a987531d2200d429b5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d7c3aec318dce8482da5dc8e240b53445b255c9260c1d1f6beb8c1938fb5ee5a/contract';
import startContract from '../../snapshots/d7c3aec318dce8482da5dc8e240b53445b255c9260c1d1f6beb8c1938fb5ee5a/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Order', column: 'adddressText' }),
      this.addColumn({
        schema: 'public',
        table: 'Order',
        column: col('addressText', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Order-addressText', {
        check: () => placeholder('backfill-Order-addressText:check'),
        run: () => placeholder('backfill-Order-addressText:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Order', column: 'addressText' }),
      this.dropNotNull({ schema: 'public', table: 'Address', column: 'line2' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
