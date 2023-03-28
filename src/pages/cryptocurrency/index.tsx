import { getLocalStorage } from "@/utils/xLocalstorage";
import { FC } from "react";

const CryptoCurrency: FC = () => {
    const coin = getLocalStorage("coin");

    console.log(coin);

    return <div>cryptocurrency</div>;
};

export default CryptoCurrency;
