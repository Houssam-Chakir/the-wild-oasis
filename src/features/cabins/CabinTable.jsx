// import styled from 'styled-components';
import CabinRow from "../cabins/CabinRow";
import Spinner from "../../ui/Spinner";
import { StyledTable } from "../../ui/Table";
// import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
// import { useCabins } from "../features/cabins/useCabins";
import { useSearchParams } from "react-router-dom";
import { Suspense } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function CabinTable() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  if (isLoading) return <Spinner />;

  return (
    <StyledTable role='table'>
      <TableHeader role='row'>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div>Discount</div>
      </TableHeader>
    {cabins.map(cabin => <CabinRow cabin={cabin} key={cabin.id} />) }
    </StyledTable>
  );
}

export default CabinTable;
