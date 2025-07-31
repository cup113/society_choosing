<script lang="ts" setup>
import { Table, TableBody, TableHeader, TableHead, TableRow, TableCell } from '@/components/ui/table';

import type { TableData, DefaultItem } from '@/stores/admission';

defineProps<{
    data: TableData;
}>();

const slots = defineSlots<{
    head: (props: {}) => any | undefined;
    cell: (props: { row: DefaultItem }) => any | undefined,
}>();
</script>

<template>
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead v-for="value, key in data.heads" :key="key">{{ value }}</TableHead>
                <TableHead v-if="slots.head"><slot name="head"></slot></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="row in data.rows" :key="row.id">
                <TableCell v-for="_, key in data.heads" :key="key">{{ row[key] }}</TableCell>
                <TableCell v-if="slots.cell"><slot name="cell" :row="row"></slot></TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>
