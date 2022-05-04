import { Modal } from "@mantine/core";
import React from "react";
import { SearchModal } from "../Pages/Main/SearchModal";
import { SearchData } from "../Type/Navbar";

type Props = {
  search: boolean;
  setSearch: React.Dispatch<React.SetStateAction<boolean>>;
  data: SearchData;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const ModalComponent = ({
  search,
  setSearch,
  data,
  value,
  setValue,
}: Props) => {
  return (
    <>
      <Modal
        centered
        opened={search}
        transition="fade"
        transitionDuration={600}
        transitionTimingFunction="ease"
        onClose={() => setSearch(false)}
      >
        <SearchModal
          setSearch={setSearch}
          data={data}
          value={value}
          setValue={setValue}
        />
      </Modal>
    </>
  );
};
