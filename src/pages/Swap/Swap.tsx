/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { Content, Loader } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { SwapAssetList } from '../../components/SwapAssetList/SwapAssetList';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { useContext } from 'react';
import SettingsContext from '../../context/SettingsContext';
import { commitmentTx, fundingTx, api, convertion } from '@bitmatrix/lib';
import { CALL_METHOD, Pool, BmConfig } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import Decimal from 'decimal.js';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import './Swap.scss';

export const Swap = (): JSX.Element => {
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [selectedAsset, setSelectedAsset] = useState<{
    from: SWAP_ASSET;
    to: SWAP_ASSET;
  }>({ from: SWAP_ASSET.LBTC, to: SWAP_ASSET.USDT });

  const [inputFromAmount, setInputFromAmount] = useState<string>('');

  const [inputToAmount, setInputToAmount] = useState<string>('');

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const [loading, setLoading] = useState<boolean>(false);

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  const onChangeFromInput = (currentPool: Pool, pool_config: BmConfig, input: string) => {
    let inputNum = Number(input);

    let methodCall;

    if (selectedAsset.from === SWAP_ASSET.LBTC) {
      inputNum = inputNum * payloadData.preferred_unit.value;
      methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
    } else {
      inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
      methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
    }

    const output = convertion.convertForCtx(inputNum, payloadData.slippage, currentPool, pool_config, methodCall);
    if (output.amount > 0) {
      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        setInputToAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
        setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
      } else {
        setInputToAmount((output.amount / payloadData.preferred_unit.value).toString());
        setAmountWithSlippage(output.amountWithSlipapge / payloadData.preferred_unit.value);
      }
    } else {
      setInputToAmount('');
      setAmountWithSlippage(0);
    }
  };

  useEffect(() => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config) {
      onChangeFromInput(payloadData.pools[0], payloadData.pool_config, inputFromAmount);
    }
  }, [inputFromAmount, payloadData]);

  // const onChangeToInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
  //   let inputNum = Number(inputElement.target.value);

  //   if (payloadData.pools && payloadData.pool_config) {
  //     let methodCall;

  //     if (selectedAsset.to === SWAP_ASSET.LBTC) {
  //       console.log('lbtc');
  //       inputNum = inputNum * payloadData.preferred_unit.value;
  //       methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //     } else {
  //       console.log('usdt');
  //       inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
  //       methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  //     }

  //     console.log(inputNum);
  //     const output = convertion.convertForCtx(
  //       inputNum,
  //       payloadData.slippage,
  //       payloadData.pools[0],
  //       payloadData.pool_config,
  //       methodCall,
  //     );

  //     console.log('2', output);

  //     if (selectedAsset.to === SWAP_ASSET.LBTC) {
  //       setInputFromAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
  //       setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
  //     } else {
  //       setInputFromAmount((output.amount / payloadData.preferred_unit.value).toString());
  //       setAmountWithSlippage(output.amountWithSlipapge / payloadData.preferred_unit.value);
  //     }

  //     setInputToAmount(inputElement.target.value);
  //   }
  // };

  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined) => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config && payloadData.wallet) {
      const currentPool = payloadData.pools[0];
      const poolConfig = payloadData.pool_config;

      let inputAmount = '';

      const quoteAssetId = currentPool.quote.asset;
      const quoteAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      if (selectedAsset.from === SWAP_ASSET.LBTC && quoteAmountInWallet) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = (quoteAmountInWallet / payloadData.preferred_unit.value).toString();
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          const quoteAmountInWalletHalf = quoteAmountInWallet / 2;
          inputAmount = (quoteAmountInWalletHalf / payloadData.preferred_unit.value).toString();
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minRemainingSupply / payloadData.preferred_unit.value).toString();
        }
      } else if (selectedAsset.from === SWAP_ASSET.USDT && tokenAmountInWallet) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          const tokenAmountInWalletHalf = tokenAmountInWallet / 2;
          inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
      }

      // onChangeFromInput(inputAmount);
      setInputFromAmount(inputAmount);
    }
    setSelectedFromAmountPercent(newFromAmountPercent);
  };

  const inputIsValid = () => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config && payloadData.wallet) {
      let inputAmount = 0;
      let poolValue = 0;

      const inputValue = Number(inputFromAmount);
      let isValid = false;

      const currentPool = payloadData.pools[0];

      const quoteAssetId = currentPool.quote.asset;
      const quoteAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;
      const quoteAmountInPool = Number(currentPool.quote.value);

      const tokenAssetId = currentPool.token.asset;
      const tokenAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;
      const tokenAmountInPool = Number(currentPool.token.value) / PREFERRED_UNIT_VALUE.LBTC;

      if (selectedAsset.from === SWAP_ASSET.LBTC && quoteAmountInWallet) {
        inputAmount = quoteAmountInWallet / payloadData.preferred_unit.value;
        poolValue = quoteAmountInPool;
      } else if (selectedAsset.from === SWAP_ASSET.USDT && tokenAmountInWallet) {
        inputAmount = tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC;
        poolValue = tokenAmountInPool;
      }

      if (inputValue <= inputAmount && inputValue <= poolValue) {
        isValid = true;
      } else {
        isValid = false;
      }

      return isValid;
    }
    return true;
  };

  const assetOnChange = (asset: SWAP_ASSET, isFrom = true) => {
    if (isFrom) {
      if (asset === SWAP_ASSET.LBTC) {
        setSelectedAsset({
          from: asset,
          to: SWAP_ASSET.USDT,
        });
      } else {
        setSelectedAsset({
          from: asset,
          to: SWAP_ASSET.LBTC,
        });
      }
    } else {
      if (asset === SWAP_ASSET.LBTC) {
        setSelectedAsset({
          from: SWAP_ASSET.USDT,
          to: asset,
        });
      } else {
        setSelectedAsset({
          from: SWAP_ASSET.LBTC,
          to: asset,
        });
      }
    }

    setInputFromAmount('');
    setInputToAmount('');
    setSelectedFromAmountPercent(undefined);
  };

  const swapRouteChange = () => {
    if (selectedAsset.from === SWAP_ASSET.LBTC) {
      setSelectedAsset({
        from: SWAP_ASSET.USDT,
        to: SWAP_ASSET.LBTC,
      });
    } else {
      setSelectedAsset({
        from: SWAP_ASSET.LBTC,
        to: SWAP_ASSET.USDT,
      });
    }

    setInputFromAmount('');
    setInputToAmount('');
    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (payloadData.wallet?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(payloadData.preferred_unit.value).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      } else {
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(payloadData.preferred_unit.value).toNumber();
      }

      if (payloadData.pools && payloadData.pool_config) {
        const fundingTxInputs = fundingTx(numberFromAmount, payloadData.pools[0], payloadData.pool_config, methodCall);

        const rawTxHex = await payloadData.wallet.marina.sendTransaction([
          {
            address: fundingTxInputs.fundingOutput1Address,
            value: fundingTxInputs.fundingOutput1Value,
            asset: fundingTxInputs.fundingOutput1AssetId,
          },
          {
            address: fundingTxInputs.fundingOutput2Address,
            value: fundingTxInputs.fundingOutput2Value,
            asset: fundingTxInputs.fundingOutput2AssetId,
          },
        ]);

        setLoading(true);

        const fundingTxId = await api.sendRawTransaction(rawTxHex || '');

        // notify(fundingTxId, 'Funding Tx Id : ', 'success');

        if (fundingTxId && fundingTxId !== '') {
          setInputFromAmount('');
          setInputToAmount('');
          setSelectedFromAmountPercent(undefined);

          const fundingTxDecode = await api.decodeRawTransaction(rawTxHex || '');

          const publicKey = fundingTxDecode.vin[0].txinwitness[1];

          let commitment;

          if (selectedAsset.from === SWAP_ASSET.LBTC) {
            commitment = commitmentTx.quoteToTokenCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              publicKey,
              numberToAmount,
              payloadData.pool_config,
              payloadData.pools[0],
            );
          } else {
            commitment = commitmentTx.tokenToQuoteCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              publicKey,
              numberToAmount,
              payloadData.pool_config,
              payloadData.pools[0],
            );
          }

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
            notify(
              <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
                See in Explorer
              </a>,
              'Commitment Tx created successfully!',
              'success',
            );
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: numberFromAmount,
              quoteAsset: selectedAsset.from,
              tokenAmount: numberToAmount,
              tokenAsset: selectedAsset.to,
              timestamp: new Date().valueOf(),
              success: false,
              completed: false,
              seen: false,
              method: methodCall,
            };

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);

            setLoading(false);
          } /* else {
            notify('Bitmatrix Error : ', 'Commitment transaction could not be created.');
          } */

          // notify('Commitment Tx Id : ', commitmentTxId);
        } else {
          notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
        }
      } else {
        notify('Pool Error', 'Error : ', 'error');
        setLoading(false);
      }
    } else {
      notify('Wallet Error', 'Error : ', 'error');
      setLoading(false);
    }
  };

  const infoMessage = (): string => {
    if (payloadData.pool_config && payloadData.pools && payloadData.pools.length > 0) {
      const config = payloadData.pool_config;
      const currentPool = payloadData.pools[0];
      const totalFee =
        config.baseFee.number +
        config.commitmentTxFee.number +
        config.defaultOrderingFee.number +
        config.serviceFee.number;

      const currentUsdtPrice = (
        (Number(currentPool.token.value) / Number(currentPool.quote.value) / PREFERRED_UNIT_VALUE.LBTC) *
        totalFee
      ).toFixed(2);

      return 'Network fee ' + totalFee + ' sats ' + '($' + currentUsdtPrice + ')';
    }
    return '';
  };

  return (
    <div className="swap-page-main">
      {/* Wallet list modal */}

      <Content className="swap-page-main-content">
        <div className="swap-page-layout">
          <div className="swap-page-content">
            {loading && <Loader className="swap-page-loading" size="md" inverse center />}
            <div className={`from-content pt8 ${!inputIsValid() ? 'invalid-content' : ''}`}>
              <SwapFromTab
                selectedFromAmountPercent={selectedFromAmountPercent}
                setselectedFromAmountPercent={calcAmountPercent}
              />
              <div className="from-input-content">
                <div className="from-amount-div">
                  <div className="from-text">From</div>
                  <NumericalInput
                    className="from-input"
                    inputValue={inputFromAmount}
                    onChange={(inputValue) => {
                      setInputFromAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                    }}
                  />
                </div>
                <SwapAssetList selectedAsset={selectedAsset.from} setSelectedAsset={assetOnChange} />
              </div>
            </div>
            <div className="swap-arrow-icon" onClick={swapRouteChange}>
              <ArrowDownIcon width="1.25rem" height="1.25rem" />
            </div>
            <div className="from-content">
              <div className="from-amount-div">
                <div className="from-text">To</div>
                <NumericalInput
                  className="from-input"
                  inputValue={inputToAmount}
                  onChange={(inputValue) => {
                    setInputToAmount(inputValue);
                    setSelectedFromAmountPercent(undefined);
                  }}
                />
              </div>
              <SwapAssetList
                selectedAsset={selectedAsset.to}
                setSelectedAsset={(asset: SWAP_ASSET) => assetOnChange(asset, false)}
              />
            </div>
            <WalletButton
              text="Swap"
              onClick={() => {
                swapClick();
              }}
              disabled={Number(inputToAmount) <= 0 || !inputIsValid()}
            />
          </div>
        </div>
        <Info content={infoMessage()} />
      </Content>
    </div>
  );
};
