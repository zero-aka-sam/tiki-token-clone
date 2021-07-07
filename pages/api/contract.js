import Web3 from "web3"

const getDividendInfo = (address,artifact) => {

    const contractAddress = "0x261550B7C7E63bFc121337aBAc9B30eFEc8a10eD";
  
    const web3Ws = new Web3(
    new Web3.providers.HttpProvider(
      "https://bsc-dataseed.binance.org/"
        ))
    
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const contract = new web3Ws.eth.Contract(artifact, contractAddress);

     contract.getNumberOfDividendTokenHolders().then(holders => {
      contract.balanceOf(address).then(balance => {
        setHoldings((balance / 1e18).toFixed(0))
          contract.getAccountDividendsInfo(address).then(result => {
              provider.getBalance(address).then(balance => {
            
              setBnbHoldings((balance/1e18).toFixed(4))
              setPaid( parseInt(result[4]._hex, 16) - parseInt(result[3]._hex, 16) )
              setLastPaid(parseInt(result[5]._hex, 16)*1000)
              setNextPayoutProgress((100-((parseInt(result[2]._hex, 16)/parseInt(holders._hex, 16))*100)).toFixed(0))
              setNextPayoutValue( (parseInt(result[3]._hex, 16)/1e18).toFixed(4) )
              window.clearTimeout(timer);
              timer = window.setTimeout(function(){ setRefreshAddressData(!refreshAddressData) }, 9000);
            })
          })
        })
      })

}

export {getDividendInfo}
