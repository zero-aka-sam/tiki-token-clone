import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import mbdABI from './artifacts/minibabydoge_abi.json';
import pcsABI from './artifacts/pcs_abi.json';

const pcsRouter = {
    address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    abi: pcsABI,
};
const bnb = {
    address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    decimals: 18,
};
const busd = {
    address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    decimals: 18,
};

const provider = new ethers.providers.JsonRpcProvider(
    'https://bsc-dataseed1.defibit.io/'
);

const mbdContractAddress = '0x261550B7C7E63bFc121337aBAc9B30eFEc8a10eD';
const mbdDecimals = 18;
const mbdContract = new ethers.Contract(mbdContractAddress, mbdABI, provider);
const pcsRouterContract = new ethers.Contract(
    pcsRouter.address,
    pcsRouter.abi,
    provider
);

async function getAmountsOut(quoteAmount, path) {
    try {
        const response = await pcsRouterContract.functions.getAmountsOut(
            quoteAmount,
            path,
            {
                gasLimit: 1000000000000,
            }
        );
        return response;
    } catch {
        return 0;
    }
}

async function getMBDPrice() {
    const functionResponse = await getAmountsOut(`${1 * 10 ** mbdDecimals}`, [
        mbdContractAddress,
        bnb.address,
        busd.address,
    ]);
    const priceInUsd =
        Number(functionResponse?.amounts?.[2].toString()) / 10 ** busd.decimals;
    // console.log('tiki', priceInUsd)
    return priceInUsd;
}

async function getBnbPrice() {
    const functionResponse = await getAmountsOut(`${1 * 10 ** bnb.decimals}`, [
        bnb.address,
        busd.address,
    ]);

    const priceInUsd =
        Number(functionResponse?.amounts?.[1].toString()) / 10 ** busd.decimals;
    // console.log('bnb', priceInUsd)
    return priceInUsd;
}

function TimeDifference(current, previous) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        const secs = Math.round(elapsed / 1000);
        return secs > 1 ? `${secs} Seconds Ago` : `${secs} Second Ago`;
    }

    if (elapsed < msPerHour) {
        const mins = Math.round(elapsed / msPerMinute);
        return mins > 1 ? `${mins} Minutes Ago` : `${mins} Minute Ago`;
    }

    if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return hours > 1 ? `${hours} Hours Ago` : `${hours} Hour Ago`;
    }

    if (elapsed < msPerMonth) {
        return `~ ${Math.round(elapsed / msPerDay)} days Ago`;
    }

    if (elapsed < msPerYear) {
        return `~ ${Math.round(elapsed / msPerMonth)} months Ago`;
    }

    return `~ ${Math.round(elapsed / msPerYear)} years Ago`;
}

let timer;

async function getMetamaskWallet() {
    let metamask;
    try {
        metamask = new ethers.providers.Web3Provider(window.ethereum, 56);
    } catch (e) {
        console.log('wrong chain');
        return null;
    }
    // Prompt user for account connections
    await metamask.send('eth_requestAccounts', []).then(() => {});
    return metamask.getSigner();
}

async function getWallet() {
    const wallet = await getMetamaskWallet();
    if (wallet === null) return false;

    const tikiContract = new ethers.Contract(
        mbdContractAddress,
        mbdABI,
        wallet
    );

    const walletAddr = await wallet.getAddress();

    return [wallet, walletAddr, tikiContract];
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* TODO: Update with miniBABYDOGE Coingecko data */
async function getMBDVolume() {
    const res = await window.fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tiki-token&vs_currencies=usd&include_market_cap=false&include_24hr_vol=true&include_24hr_change=false&include_last_updated_at=false'
    );
    const resolved = await res.json();
    const volume = resolved['tiki-token'].usd_24h_vol;
    return volume;
}

export default function Home({ address }) {
    const [wallet, setWallet] = useState(null);

    const [holdings, setHoldings] = useState(0);
    const [bnbHoldings, setBnbHoldings] = useState(0);
    const [paid, setPaid] = useState(0);
    const [lastPaid, setLastPaid] = useState(0);
    const [nextPayoutProgress, setNextPayoutProgress] = useState(0);
    const [nextPayoutValue, setNextPayoutValue] = useState(0);

    const [refreshAddressData, setRefreshAddressData] = useState(true);
    const [refreshTimeData, setRefreshTimeData] = useState(true);

    const [mbdVolume, setMBDVolume] = useState(null);
    const [bnbPrice, setBnbPrice] = useState(null);
    const [mbdPrice, setMBDPrice] = useState(null);

    const callContract = () => {
        mbdContract.getNumberOfDividendTokenHolders().then((holders) => {
            mbdContract.balanceOf(address).then((balance) => {
                setHoldings((balance / 1e18).toFixed(0));
                mbdContract.getAccountDividendsInfo(address).then((result) => {
                    provider.getBalance(address).then((_balance) => {
                        setBnbHoldings((_balance / 1e18).toFixed(4));
                        setPaid(
                            parseInt(result[4]._hex, 16) -
                                parseInt(result[3]._hex, 16)
                        );
                        setLastPaid(parseInt(result[5]._hex, 16) * 1000);
                        setNextPayoutProgress(
                            (
                                100 -
                                (parseInt(result[2]._hex, 16) /
                                    parseInt(holders._hex, 16)) *
                                    100
                            ).toFixed(0)
                        );
                        setNextPayoutValue(
                            (parseInt(result[3]._hex, 16) / 1e18).toFixed(4)
                        );
                        window.clearTimeout(timer);
                        timer = window.setTimeout(() => {
                            setRefreshAddressData(!refreshAddressData);
                        }, 9000);
                    });
                });
            });
        });
    };

    useEffect(() => {
        getMBDVolume().then((res) => {
            setMBDVolume(res);
        });

        getBnbPrice().then((res) => {
            setBnbPrice(res);
        });

        getMBDPrice().then((res) => {
            setMBDPrice(res);
        });

        if (ethers.utils.isAddress(address)) {
            if (localStorage.getItem('address') !== address)
                localStorage.setItem('address', address);
            callContract(address);
        }
    }, [address, refreshAddressData]);

    const earningsInDollars =
        mbdVolume === 0
            ? (holdings / 1000000000) * 220000
            : (holdings / 1000000000) * (mbdVolume * 0.11);
    const earningsInBnb = earningsInDollars / bnbPrice;

    const payoutText = (
        <>
            <span className="text-pink-300">
                {nextPayoutValue !== 0
                    ? `${nextPayoutValue} BNB`
                    : 'Processing'}
            </span>
            {Date.now() - lastPaid >= 3600000
                ? ` | ${nextPayoutProgress}%`
                : ` | ${(60 - (Date.now() - lastPaid) / 60000).toFixed(0)}m`}
        </>
    );
    const compoundedMBDAfterNDays = (starting, days) => {
        let accumulatedTiki = Number(starting);
        for (let i = 0; i < days; i++) {
            accumulatedTiki =
                mbdVolume === 0
                    ? accumulatedTiki +
                      ((accumulatedTiki / 1000000000) * 220000) / mbdPrice
                    : accumulatedTiki +
                      ((accumulatedTiki / 1000000000) * (mbdVolume * 0.11)) /
                          mbdPrice;
        }
        return accumulatedTiki.toFixed(0);
    };

    return (
        <div className="h-screen  overflow-y-scroll ">
            <div className="max-w-screen-lg mx-auto py-5 mb-10 bg-pink-100">
                <section className="">
                    <div className="w-11/12  mx-auto">
                        <h1 className="text-4xl font-semibold text-black dark:text-red-600">
                            miniBABYDOGE Earnings Dashboard
                        </h1>
                        <div className="text-white text-xl flex flex-row justify-between p-3 my-3 rounded bg-red-700">
                            <div>
                                <h1>Please enter your address above</h1>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4  ">
                            <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400">
                                <div className="p-4 flex items-center">
                                    <div className="p-3 rounded-md text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
                                        <p className="mb-2 text-m align-bottom font-semibold text-gray-600 dark:text-gray-100">
                                            Your Holdings
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{`${numberWithCommas(
                                            holdings
                                        )}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400">
                                <div className="p-4 flex items-center">
                                    <div className="p-3 rounded-md text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
                                        <p className="mb-2 text-m align-bottom font-semibold text-gray-600 dark:text-gray-100">
                                            Total BNB Paid
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{`${(
                                            paid / 1e18
                                        ).toFixed(4)}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400">
                                <div className="p-4 flex items-center">
                                    <div className="p-3 rounded-md text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
                                        <p className="mb-2 text-m align-bottom font-semibold text-gray-600 dark:text-gray-100">
                                            Last Payout Time
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{`${
                                            lastPaid === 0
                                                ? 'Never'
                                                : TimeDifference(
                                                    Date.now(),
                                                      lastPaid
                                                )
                                        }`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400">
                                <div className="p-4 flex items-center">
                                    <div className="p-3 rounded-md text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4">
                                        <p className="mb-2 text-m align-bottom font-semibold text-gray-600 dark:text-gray-100">
                                            Payout Loading
                                        </p>
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                            {payoutText}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400 mt-4">
                            <div className="p-4 flex items-center">
                                <button
                                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-red-700 border-8 border-transparent opacity-50 w-full h-full  "
                                    disabled
                                    type="button"
                                >
                                    Payout Is Processing
                                </button>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="border-8 border-gray-100 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400 col-span-2">
                                <div className="p-4 flex flex-col text-center items-center">
                                    <img
                                        className="w-32 h-32 mb-4 mt-4"
                                        src="miniBABYDOGE.png "
                                        alt="miniBABYDOGE"
                                    />
                                    <p className="mt-4 font-semibold text-gray-600 dark:text-gray-100 text-3xl text-center">
                                        Total BNB Paid To miniBABYDOGE Holders
                                    </p>
                                    <p className="text-pink-500 dark:text-pink-500 text-4xl md:text-6xl text-center mb-8">
                                        17,555
                                        <span className="text-red-600">
                                            BNB
                                        </span>
                                        <br />
                                        =$5,122,290
                                    </p>
                                </div>
                            </div>

                            <div className="border-8 border-gray-100 min-w-0 rounded-lg shadow-xs overflow-hidden bg-white dark:bg-red-400 col-span-2">
                                <div className="p-4 flex flex-col text-center items-center">
                                    <img
                                        className="w-32 h-32 mb-4 mt-4"
                                        src="miniBABYDOGE.png "
                                        alt="miniBABYDOGE"
                                    />
                                    <p className="mt-4 font-semibold text-gray-600 dark:text-gray-100 text-3xl text-center">
                                        Your {numberWithCommas(holdings)}{' '}
                                        miniBABYDOGE Earns:
                                    </p>
                                    <div className="flex">
                                        <p className="text-pink-500 dark:text-pink-500 text-2xl text-center">
                                            <span className="text-red-600">
                                                {numberWithCommas(
                                                    earningsInBnb.toFixed(2)
                                                )}{' '}
                                                BNB
                                            </span>
                                            ($
                                            {numberWithCommas(
                                                earningsInDollars.toFixed(2)
                                            )}
                                            )
                                            <span className="text-gray-600 dark:text-gray-100 text-xl text-center ml-2 mt-2">
                                                Per Day
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-pink-500 dark:text-pink-500 text-2xl text-center">
                                            <span className="text-red-600">
                                                {numberWithCommas(
                                                    (earningsInBnb * 7).toFixed(
                                                        2
                                                    )
                                                )}
                                            </span>
                                            ($
                                            {numberWithCommas(
                                                (earningsInDollars * 7).toFixed(
                                                    2
                                                )
                                            )}
                                            )
                                            <span className="text-gray-600 dark:text-gray-100 text-xl text-center ml-2 mt-2">
                                                Per Week
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-pink-500 dark:text-pink-500 text-2xl text-center">
                                            <span className="text-red-600">
                                                {numberWithCommas(
                                                    (
                                                        earningsInBnb * 30
                                                    ).toFixed(2)
                                                )}{' '}
                                            </span>
                                            ($
                                            {numberWithCommas(
                                                (
                                                    earningsInDollars * 30
                                                ).toFixed(2)
                                            )}
                                            )
                                            <span className="text-gray-600 dark:text-gray-100 text-xl text-center ml-2 mt-2">
                                                Per Month
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <p className="text-pink-500 dark:text-pink-500 text-2xl text-center">
                                            <span className="text-red-600">
                                                {numberWithCommas(
                                                    (
                                                        earningsInBnb * 365
                                                    ).toFixed(2)
                                                )}
                                            </span>
                                            ($
                                            {numberWithCommas(
                                                (
                                                    earningsInDollars * 365
                                                ).toFixed(2)
                                            )}
                                            )
                                            <span className="text-gray-600 dark:text-gray-100 text-xl text-center ml-2 mt-2">
                                                Per Year
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-gray-600 py-1 dark:text-gray-100 text-xl text-center -mt-2">
                                        Dynamic estimations based on 24h of
                                        trading volume 30,000
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </section>
            </div>
        </div>
    );
}
