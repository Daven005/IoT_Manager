var handler = require('./index').handler;

let heatingRequest = {
    "directive": {
        "header": {
            "namespace": "Alexa.ThermostatController",
            "name": "SetTargetTemperature",
            "payloadVersion": "3",
            "messageId": "b819005f-5391-4a26-9192-41d100ea47d4",
            "correlationToken": "AAAAAAAAAQCAAWbXr5W2VVhB+b2WeyzbDAIAAAAAAACfPY3ESSptmH32p8VE5qxcepDlSJchcv9OWIpM1KQBEjbMxcYjMuPDcqxOFNBdiFDH7AdZTd/mDlkQkUyMYKm6rEoJgC+vNeTSWmDOBLBKWC2IkXz45Op0RD+OzcRrUT/ssqBuwP7R8oqf50u8ertQ1YHcAzLCZcN+MMgrce+8SIxCec8Vt6twk76BOaNidP4JaAYRxiMxuyiaPJTvhkLLrXkyn5HbENuLkbXZgDedmoZxlBjbTe0Tjqa9rS9U+pywNn2E2LNyFrNxK+iO9Fsc1wq6BM1jkCYTt9/ZadiVOxDKEiDN9z82GC4jOqkSn8qlICGImej8vgTkjudyoKUxGn+PnuBV682Qm7dPMzO8l7s+hjwmK8RxcW9ew1mg7hsGv4jh1nWp6y+VT4wf5wvPEHMtuhRF5zXnXTpFd3QVdY+Y7bBQGAHJn86ixsZzQuBorQMrDBuihqliJMalXY+e7dFa85ve5aYS0MRvCUnTudwZNt6PewgxTyoppGnMVwn/mRKnVy3UhiPPH/OWz3b+osmYT8qTKhk8skDfKgGa+YNKQPmnis7xVN/OKhkAoHJfYZYOuJqhkhfXJxwYqOoJxntnq/BAY/XbcgbIA+lpFHezSZs4TEmh6gh4lgCbakIEgpRzh2zR2+X1hgFfIDYlaMfw2IiBl2PBVW8B9jPMVqmNTokhaUNEiQofWg=="
        },
        "endpoint": {
            "scope": {
                "type": "BearerToken",
                "token": "Atza|IwEBIO1gwtTi7c3eNVepPjFLzVbpch7_gh0GUhLGEEQfSraopplD-mEsLcVtucFuf_gWGFx5J9TA3A1mNcs9-ftO5zVfc6BlSbo8eH6ayJTMeKVb4uwgRCaIcq_3lMlj1ipotHKGt5wl6zg6rR0lyTaMbbmeoNmwyOE20eYzmS7-d5GRwKEwO6_JzA7Z0QhQ_A3tQh3vVCGvwaBEG51zCvpY366xZrf5Kk92Qu3wHu0uiDoyUdgKHAWoeUJ91bayT5vn3oziLnIk__FSBugL7JHSuKxLtlEvnpogd9S_GeNwue268WpHN7Dq-3w_JSFvsAVDaQ5EnLJto-bzK14XGQci03d4g96x9i9ZbjAzUgwDrJD8DkeuWpgiXVl-gXf1zQaTcBbimKAIrzmHO08TSKRNXfPN7dR5V_QxCVHiQhSTOXZgkzFFosfA1A7Z4rvL6gyXOvDCqDrTuA-YLs3RP-gsg5BHvO17agCevvAotwS9qSmODxgwf89uQFkThTrctmOQxjw"
            },
            "endpointId": "H5",
            "cookie": {
                "TemperatureDeviceID": "Holliesd82273",
                "currentTemperature": "19",
                "TemperatureMin": "12",
                "targetTemp": "16",
                "ControlDeviceID": "Hollies11c554",
                "HeatGainConstant": "-0.708867",
                "overrideName": "Alexa",
                "MasterZone": "5",
                "isChangeable": "true",
                "TemperatureSensorID": "28ff7f1d6714025b",
                "TemperatureMax": "22",
                "demand": "false",
                "Name": "Dining",
                "HeatLossConstant": "0.109119",
                "ControlSensorID": "23",
                "overrideOn": "true",
                "HeatGainRate": "0.06315",
                "IsMaster": "0",
                "overrideID": "29",
                "ID": "5",
                "HeatLossRate": "-0.011018"
            }
        },
        "payload": {
            "targetSetpoint": {
                "value": 13.5,
                "scale": "CELSIUS"
            }
        }
    }
};
let lightingRequest = {
    "directive": {
        "header": {
            "namespace": "Alexa.BrightnessController",
            "name": "AdjustBrightness",
            "payloadVersion": "3",
            "messageId": "f3077737-b50d-4a62-b2e8-1f92b279805f",
            "correlationToken": "AAAAAAAAAQDAOes3NAbjA6qNDv1s5kBxDAIAAAAAAABhU6V7c3PkO5V/F7/ugAbUYKvUIe1WoBYBrntsGsB64QYuEBJCpkBTBE9l7ydB/PVI9/QX1dvm/hUXrAzfohMqVOCLK9JITyTOAOYu1aIq4Q0CkdOQb16q0oJwn3zq36lVjDyJWl7fqe+OYxUEne9OPMQT3XmsKdxEQY5lEqeG18NX679h/G5lLVfAHUgukPGmgwccEGT1DF+EdQxVVwDlCh/9LetAi8LvVNBsH0P5Dp2cPP02DmNQVZw2lMtTtZ+Y5gRNxta0IaiyNMEZcoU/HlDj1/5Pmw0MqAe5OE13nl3xN7VRy2/i2eouklCpqX4OW7rhzy65q4vXe55EU9J5sRMTRMwme3Kp/OmItijKs9hRQjd/fKdqEYo4LsHuD+SuzlzTvxOmBKoLP7tWvAqtH29pxiLK8ZZD40gnem+z1qiOOceJTTz2lCF2IaKbOeUlxzkwIcuB14S2wfuTQMh9KdoZ3lJmuashZ0uBsIezhvOBio/ADQPXraH29TvY1+5f0HlJtl0y9k32DdwsZOPHJHg7gtGRNg+kVq9nrYTiO+8Eqqx3Vlna0KyIFWPNP7hUrxPlqIPFjVSd5ldpHn8yE4mbiJoRysmTIGIAhkoZCLbOynrrW3nHvoswV2GMiTS9kxiI7n04TrUh888Pt98rYDhySL4UDLcklDSk2XbcTUu6r8FmCwIjnctj+Q=="
        },
        "endpoint": {
            "scope": {
                "type": "BearerToken",
                "token": "Atza|IwEBIILhUYvbUyHUPldtH0Byxc1rjKY3bJXGjORQGLnhHozvBmmS6oydLDEt4KNrvWyuGtRWXGNLQiMLYtwK6tmo6k2Qorygpm_XymNFK4S6K8uFDkUe99LwZ83vyrQxdAjoGe15X1-fIULWaVKbyNgTXMczN7S5JQYhx4873vWWH39Mn2g7Y7AfzA4yu0U_Z2ANKhWDWOD8USr1fggx9W6gi2-Z_x0t9iLciuI6mDDR6ejUZ1qFlYJrVpu-ZXmqQ66YvlT-WFPVEiiaayuJWo7pIurtTBTWrfkfCGJzFnQEIw0XVKN9mD5zP2Jm31ZOgI9YoCXhSxOqB0QvsJnh1NaDUVw3_0Z-HjiNz8btFJ0iQL3JWo8CraEShrqxyTaqX_l6ACtoHZI44XXkDxn8iXimDipe2VCwgLxVGVhFMClHjumvAMTP1hXvUIx_2EiTRUOHQtUfuDhwd3eMvzyNuEUXkNn2Mv-sbU67qSsgV3-n3Ys7BqZiLSPizKk7uH_iBC01NmU"
            },
            "endpointId": "S4",
            "cookie": {
                "lower": "Office Dim",
                "raise": "Office On",
                "TLc": "Hollies-L",
                "id": "S4",
                "off": "Office Off",
                "on": "Office On",
                "level": 0
            }
        },
        "payload": {
            "brightnessDelta": -25
        }
    }
};
let context = {};
function cb(err, response) {
    console.log("*******************************************");
    if (err)
        console.log(err);
    else if (response.context)
        console.log(JSON.stringify(response.context.properties, null, 2));
    else
        console.log(JSON.stringify(response, null, 2));
}

heatingRequest.directive.payload.targetSetpoint.value = 5;
handler(heatingRequest, context, cb);
heatingRequest.directive.payload.targetSetpoint.value = 12;
handler(heatingRequest, context, cb);
heatingRequest.directive.payload.targetSetpoint.value = 30;
handler(heatingRequest, context, cb);

heatingRequest = {
    directive: {
        header: {
            namespace: "Alexa.ThermostatController",
            name: "AdjustTargetTemperature",
            payloadVersion: "3",
            messageId: "feead1af-0aae-4e00-be40-6778e048578e",
            correlationToken: "AAAAAAAAAQAdIBTvHDH6S7exrDlXC+8+DAIAAAAAAABKPd4GvxC2JgOy5geqtDGXbtLmB7U8C8KGM8jel4T1wquokcsv0YxzV823TvcjGR0Tzb8t/f6TJH9thCz9BIMq6wwb9J0y6w71FHNvGKtkbCbfBj3wUy0xKA+y3/Lq1nvDp15PMGxwyrsGKsSv3qh7HvqygstvzqVzDDpMYXeFizZtDQWIvGKnzbA2p9D6Lw6kv0QLqcMNMOdeX7UU5gnid3GYUMLJCu6cKZxBnGKN3FY0C+xZE/iFPs08fapzEGkgmaXyGRlN4k0b/2uA9AVj+l27HxrysuMkfuGmx/GhDlxb6YJUpEYyRYT2o0NkXpLEej8yyloiQB4D0oideUf2JPYRRF18GXQXzHCpHv+toksyoMWw6xX7GYMSXQ71850LAvnfW/N2ITiXjADKAVU7gjQI6R7eUamEYzoJC1TkCvlNnEyGFSh1j36sWZsOFgQJfdKcCHZoUr16zin1VLarWClJK34jubG8JDg9EmM3Iyw9INQapsed9yKlBvRhfvv1qtoivmEiLNsA4ikhRQE9HjOWqBi6156Y6fyExlUuFwwTL8plJpjsoxSgk/6kBnsm2OghF2Jam4b7P2siTgYz9GwnXwecJ2QFTCyVgbsKb53W2RKkff4w/uvXMdwXk84FULz1Pa4+SpO28SOaUX90DctfQ0FggGYt9cUj2Xta0Z7mOWvUzV/foDrjeQ=="
        },
        endpoint: {
            scope: {
                type: "BearerToken",
                token: "Atza|IwEBIH3zYRt_qGA7Gf7dX4yPTlHr8NRE4GNXVn5yjOHwEE8_zo3mu2oaDhjp1zujTNwSkf4CJDj7McNbcwzjthZdhvoCXWInvR4axJD0pp2BvO73nvd0an0Uq9WJcxgMe0a4Jw2k7xjrW6Iz7oaSNWMCBlwdWjJeKQV4uL4fGH7_cajlu8QEP_H2WUxo8g0bpLa7JyTD2qj_FSjQWeikGsc9wmBfC3d2ZWofJa3-oNxtjPRs5hqZlLBhWe82GabsoIvxLylaGkR9Gx2DUDrlEoExiGwO38D7OCYnMcaqrJH4bRRqksG6hfzVtH4KDqg_Y3fL15p5Pul7Uv8Ot7UvrCZvqZzcRbbigcpiEllmXoJPP3WQxo4kpMqtMFG24TDVKJ-C_z4rDKMpNDzb463w4AfiK_zyc_GBbpma8GhV4XdX39VHt_AF2Cv7mItD-1egbpayulxIv8kDDrbF0v-xyeH28UREameFw9TRb9-jCH174ulFlm9iOtFS-RviP4V2d39k28s"
            },
            endpointId: "H7",
            cookie: {
                TemperatureDeviceID: "Holliesd2f35e",
                currentTemperature: "17.56",
                TemperatureMin: "12",
                targetTemp: "15",
                ControlDeviceID: "Holliesd2f35e",
                HeatGainConstant: "0",
                overrideName: null,
                MasterZone: "8",
                isChangeable: "true",
                TemperatureSensorID: "28d8b47c050000a4",
                TemperatureMax: "20",
                demand: "false",
                Name: "Bedroom",
                HeatLossConstant: "0",
                ControlSensorID: "4",
                overrideOn: "false",
                HeatGainRate: "0.001",
                IsMaster: "0",
                overrideID: "7",
                ID: "7",
                HeatLossRate: "0"
            }
        },
        payload: {
            targetSetpointDelta: {
                value: 5,
                scale: "FAHRENHEIT"
            }
        }
    }
}

handler(heatingRequest, context, cb);
heatingRequest.directive.payload.targetSetpointDelta.value = -5;
handler(heatingRequest, context, cb);

handler(lightingRequest, context, cb);